import {FindOptions, FindOptionsWhere} from "../find-options/FindOptions";
import {EntityManager, EntityMetadata, EntitySubscriberInterface, InsertEvent, ObjectLiteral} from "../index";
import {Subject} from "../persistence/Subject";
import {SubjectChangedColumnsComputer} from "../persistence/SubjectChangedColumnsComputer";
import Observable = require("zen-observable");

// todo: we probably need operation-level subscribers
// todo: right now if we save 1000 entities within a single save call its going to call this code 1000 times
// todo: which is not efficient

/**
 * Entity manager supposed to work with any entity, automatically find its repository and call its methods,
 * whatever entity type are you passing.
 */
export class QueryObserver {

    private isSubscriberActive: boolean = false;
    private lastEmitEntities: ObjectLiteral[] = [];
    private lastEmitEntity: ObjectLiteral|undefined;
    private lastEmitCount: number;
    private subscriptionObserver: ZenObservable.SubscriptionObserver<any>;

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(
        private manager: EntityManager,
        private type: "find"|"findOne"|"findAndCount"|"count",
        private metadata: EntityMetadata,
        private options?: FindOptions<any>|FindOptionsWhere<any>,
    ) {
    }

    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------

    /**
     * Finds entities that match given options and returns observable.
     * Whenever new data appears that matches given query observable emits new value.
     */
    observe(): Observable<any> {

        return new Observable(subscriptionObserver => {
            this.subscriptionObserver = subscriptionObserver;
            this.isSubscriberActive = true;

            // we find entities matching our query
            switch (this.type) {
                case "find":
                    this.manager.find(this.metadata.target, this.options as any).then(entities => {
                        subscriptionObserver.next(entities);
                        this.lastEmitEntities = entities;
                        this.manager.connection.subscribers.push(this.subscriber);
                    });
                    break;

                case "findOne":
                    this.manager.findOne(this.metadata.target, this.options as any).then(entity => {
                        subscriptionObserver.next(entity);
                        this.lastEmitEntity = entity;
                        this.manager.connection.subscribers.push(this.subscriber);
                    });
                    break;

                case "findAndCount":
                    this.manager.findAndCount(this.metadata.target, this.options as any).then(([entities, count]) => {
                        subscriptionObserver.next([entities, count]);
                        this.lastEmitCount = count;
                        this.lastEmitEntities = entities;
                        this.manager.connection.subscribers.push(this.subscriber);
                    });
                    break;

                case "count":
                    this.manager.count(this.metadata.target, this.options as any).then(count => {
                        subscriptionObserver.next(count);
                        this.lastEmitCount = count;
                        this.manager.connection.subscribers.push(this.subscriber);
                    });
                    break;
            }

            // remove subscription on cancellation
            return () => {
                // remove registered subscriber
                if (this.subscriber) {
                    const index = this.manager.connection.subscribers.indexOf(this.subscriber);
                    if (index !== -1)
                        this.manager.connection.subscribers.splice(index, 1);
                }
            };
        });
    }

    // -------------------------------------------------------------------------
    // Private Properties
    // -------------------------------------------------------------------------

    private findInserted(entities: ObjectLiteral[], lastEmitEntities: ObjectLiteral[]) {

        // to make sure we won't have instance mess we try to return array of NEW entities
        // in the same NEW order we have, but with OLD instances that we can find in the
        let hasChange = false;
        entities = entities.map(entity => {
            const sameEntityInPrevious = lastEmitEntities.find(previousEntity => {
                return this.metadata.compareEntities(entity, previousEntity);
            });
            if (sameEntityInPrevious) {
                return sameEntityInPrevious;
            } else {
                hasChange = true;
                return entity;
            }
        });

        // if we have any new entity emit a new event
        if (hasChange)
            return entities;

        return undefined;
    }

    private hasChanges(entity: ObjectLiteral) {

        let previousEntity: ObjectLiteral|undefined;
        if (this.type === "find" || this.type === "findAndCount") {
            previousEntity = this.lastEmitEntities.find(previousEntity => {
                return this.metadata.compareEntities(previousEntity, entity);
            });
        } else if (this.type === "findOne") {
            previousEntity = this.lastEmitEntity;
        }

        // if previous entity is not set it probably means it was failed off the condition first,
        // then update causes it to match the condition
        if (!previousEntity)
            return true;

        const subject = new Subject({
            metadata: this.metadata,
            entity: entity,
            databaseEntity: previousEntity,
        });

        // find changed columns - if we have them
        new SubjectChangedColumnsComputer().compute([subject]);
        return subject.changeMaps.length > 0;
    }

    private hasRemoved(entities: ObjectLiteral[]) {
        let hasChange = false;

        if (this.type === "find" || this.type === "findAndCount") {
            this.lastEmitEntities.forEach(previousEntity => {
                const entity = entities.find(entity => {
                    return this.metadata.compareEntities(previousEntity, entity);
                });

                if (!entity) {
                    hasChange = true;
                    this.lastEmitEntities.splice(this.lastEmitEntities.indexOf(previousEntity), 1);
                }
            });
        } else if (this.type === "findOne") {
            if (!this.lastEmitEntity)
                return false;

            const entity = entities.find(entity => {
                return this.metadata.compareEntities(this.lastEmitEntity!, entity);
            });
            if (!entity)
                return false;
        }

        return hasChange;
    }


    private subscriber: EntitySubscriberInterface<any> = {
        listenTo: () => {
            return this.metadata.target;
        },
        afterInsert: (event: InsertEvent<any>) => {
            if (!this.subscriptionObserver || !this.isSubscriberActive)
                return;

            // if something new is inserted - we never know if that matches original query
            // so we execute query again and emit event if we find something new
            if (this.type === "find") {
                this.manager.find(this.metadata.target, this.options as any).then(entities => {
                    const newEntities = this.findInserted(entities, this.lastEmitEntities);
                    if (newEntities) {
                        this.lastEmitEntities = newEntities;
                        this.subscriptionObserver.next(this.lastEmitEntities);
                    }
                });

            } else if (this.type === "findOne") {
                this.manager.findOne(this.metadata.target, this.options as any).then(entity => {
                    if (!entity) {
                        this.lastEmitEntity = undefined;
                        this.subscriptionObserver.next(this.lastEmitEntity);
                        return;
                    }
                    const newEntities = this.findInserted([entity], this.lastEmitEntities);
                    if (newEntities) {
                        this.lastEmitEntity = newEntities[0];
                        this.subscriptionObserver.next(this.lastEmitEntity);
                    }
                });

            } else if (this.type === "findAndCount") {
                this.manager.findAndCount(this.metadata.target, this.options as any).then(([entities, count]) => {
                    const newEntities = this.findInserted(entities, this.lastEmitEntities);
                    if (newEntities || count !== this.lastEmitCount) {
                        if (newEntities)
                            this.lastEmitEntities = newEntities;
                        if (count !== this.lastEmitCount)
                            this.lastEmitCount = count;

                        this.subscriptionObserver.next([this.lastEmitEntities, this.lastEmitCount]);
                    }
                });

            } else if (this.type === "count") {
                this.manager.count(this.metadata.target, this.options as any).then(count => {
                    if (count !== this.lastEmitCount) {
                        this.lastEmitCount = count;
                        this.subscriptionObserver.next(this.lastEmitCount);
                    }
                });
            }

        },
        afterUpdate: event => {
            if (!this.subscriptionObserver || !this.isSubscriberActive)
                return;

            // if something is updated - we check if its any entity of the queried entities
            // and if it is, we compare properties to understand if something was changed
            // and emit event if something was
            if (event.entity &&
                this.metadata.hasId(event.entity) &&
                this.type !== "count") {

                if (this.hasChanges(event.entity)) {
                    if (this.type === "find") {
                        this.manager
                            .find(this.metadata.target, this.options as any)
                            .then(entities => {
                                this.lastEmitEntities = entities;
                                this.subscriptionObserver.next(this.lastEmitEntities);
                            });

                    } else if (this.type === "findOne") {
                        this.manager
                            .findOne(this.metadata.target, this.options as any)
                            .then(entity => {
                                this.lastEmitEntity = entity;
                                this.subscriptionObserver.next(this.lastEmitEntity);
                            });

                    } else if (this.type === "findAndCount") {
                        this.manager
                            .findAndCount(this.metadata.target, this.options as any)
                            .then(([entities, count]) => {
                                this.lastEmitEntities = entities;
                                this.lastEmitCount = count;
                                this.subscriptionObserver.next([this.lastEmitEntities, this.lastEmitCount]);
                            });
                    }
                }
            } else {

                if (this.type === "find") {
                    this.manager
                        .find(this.metadata.target, this.options as any)
                        .then(entities => {
                            const hasChanges = entities.some(entity => this.hasChanges(entity));
                            if (hasChanges) {
                                this.lastEmitEntities = entities;
                                this.subscriptionObserver.next(this.lastEmitEntities);
                            }
                        });

                } else if (this.type === "findOne") {
                    this.manager
                        .findOne(this.metadata.target, this.options as any)
                        .then(entity => {
                            if (!entity) {
                                this.lastEmitEntity = undefined;
                                this.subscriptionObserver.next(this.lastEmitEntity);
                            } else if (this.hasChanges(entity)) {
                                this.lastEmitEntity = entity;
                                this.subscriptionObserver.next(this.lastEmitEntity);
                            }
                        });

                } else if (this.type === "findAndCount") {
                    this.manager
                        .findAndCount(this.metadata.target, this.options as any)
                        .then(([entities, count]) => {

                            const hasChanges = entities.some(entity => this.hasChanges(entity));
                            if (hasChanges || count !== this.lastEmitCount) {
                                if (hasChanges)
                                    this.lastEmitEntities = entities;
                                if (count !== this.lastEmitCount)
                                    this.lastEmitCount = count;

                                this.subscriptionObserver.next([this.lastEmitEntities, this.lastEmitCount]);
                            }
                        });
                } else if (this.type === "count") {
                    this.manager
                        .count(this.metadata.target, this.options as any)
                        .then(count => {
                            if (count !== this.lastEmitCount) {
                                this.lastEmitCount = count;
                                this.subscriptionObserver.next(this.lastEmitCount);
                            }
                        });
                }

            }
        },
        afterRemove: event => {
            if (!this.subscriptionObserver || !this.isSubscriberActive)
                return;

            // if something is removed we have to check:
            // - if entity with id was removed we check if its that entity
            // - if entity by query was removed we do execute original query again and differ

            if (event.entityId && this.type !== "count") {

                if (this.type === "find") {
                    const findPreviousEntity = this.lastEmitEntities.find(entity => {
                        return this.metadata.compareEntities(entity, this.metadata.ensureEntityIdMap(event.entityId));
                    });
                    if (findPreviousEntity) {
                        this.lastEmitEntities.splice(this.lastEmitEntities.indexOf(findPreviousEntity), 1);
                        this.subscriptionObserver.next(this.lastEmitEntities);
                    }

                } else if (this.type === "findAndCount") {
                    const findAndCountPreviousEntity = this.lastEmitEntities.find(entity => {
                        return this.metadata.compareEntities(entity, this.metadata.ensureEntityIdMap(event.entityId));
                    });
                    if (findAndCountPreviousEntity) {
                        this.lastEmitEntities.splice(this.lastEmitEntities.indexOf(findAndCountPreviousEntity), 1);
                        this.lastEmitCount--;
                        this.subscriptionObserver.next([this.lastEmitEntities, this.lastEmitCount]);

                    }

                } else if (this.type === "findOne") {
                    if (this.lastEmitEntity) {
                        if (this.metadata.compareEntities(this.lastEmitEntity, this.metadata.ensureEntityIdMap(event.entityId))) {
                            this.lastEmitEntity = undefined;
                            this.subscriptionObserver.next(this.lastEmitEntity);
                        }
                    }
                }

            } else {

                if (this.type === "find") {
                    if (!this.lastEmitEntities.length && !this.lastEmitCount)
                        return;

                    this.manager.find(this.metadata.target, this.options as any).then(entities => {

                        // if we have any new entity emit a new event
                        if (this.hasRemoved(entities)) {
                            this.lastEmitEntities = entities;
                            this.subscriptionObserver.next(this.lastEmitEntities);
                        }
                    });

                } else if (this.type === "findAndCount") {
                    if (!this.lastEmitEntities.length && !this.lastEmitCount)
                        return;

                    this.manager.findAndCount(this.metadata.target, this.options as any).then(([entities, count]) => {

                        // if we have any new entity emit a new event
                        if (this.hasRemoved(entities) || this.lastEmitCount !== count) {
                            this.lastEmitEntities = entities;
                            this.lastEmitCount = count;
                            this.subscriptionObserver.next([this.lastEmitEntities, this.lastEmitCount]);
                        }
                    });

                } else if (this.type === "findOne") {
                    if (!this.lastEmitEntity)
                        return;

                    this.manager.findOne(this.metadata.target, this.options as any).then(entity => {
                        if (!entity) {
                            this.lastEmitEntity = undefined;
                            this.subscriptionObserver.next(this.lastEmitEntity);
                            return;
                        }

                        // if we have any new entity emit a new event
                        if (this.hasRemoved([entity])) {
                            this.lastEmitEntity = undefined;
                            this.subscriptionObserver.next(this.lastEmitEntity);
                        }
                    });

                } else if (this.type === "count") {
                    if (!this.lastEmitCount)
                        return;

                    this.manager.count(this.metadata.target, this.options as any).then(count => {
                        if (this.lastEmitCount !== count) {
                            this.lastEmitCount = count;
                            this.subscriptionObserver.next(this.lastEmitCount);
                        }
                    });
                }

            }
        }
    };

}