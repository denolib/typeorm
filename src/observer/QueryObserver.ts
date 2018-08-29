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
    private subscriptionObserver: ZenObservable.SubscriptionObserver<any>;

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(
        private manager: EntityManager,
        private type: "find"|"findOne"|"findAndCount",
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

                case "findAndCount":
                    this.manager.find(this.metadata.target, this.options as any).then(result => {
                        subscriptionObserver.next(result);
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

    private subscriber: EntitySubscriberInterface<any> = {
        listenTo: () => {
            return this.metadata.target;
        },
        afterInsert: (event: InsertEvent<any>) => {
            if (!this.subscriptionObserver || !this.isSubscriberActive)
                return;

            // if something new is inserted - we never know if that matches original query
            // so we execute query again and emit event if we find something new

            this.manager.find(this.metadata.target, this.options as any).then(entities => {

                // to make sure we won't have instance mess we try to return array of NEW entities
                // in the same NEW order we have, but with OLD instances that we can find in the
                let hasChange = false;
                entities = entities.map(entity => {
                    const sameEntityInPrevious = this.lastEmitEntities.find(previousEntity => {
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
                if (hasChange) {
                    this.lastEmitEntities = entities;
                    this.subscriptionObserver.next(this.lastEmitEntities);
                }
            });
        },
        afterUpdate: event => {
            if (!this.subscriptionObserver || !this.isSubscriberActive)
                return;

            // if something is updated - we check if its any entity of the queried entities
            // and if it is, we compare properties to understand if something was changed
            // and emit event if something was
            if (event.entity && this.metadata.hasId(event.entity)) {
                const previousEntity = this.lastEmitEntities.find(entity => {
                    return this.metadata.compareEntities(entity, event.entity);
                });
                if (previousEntity) {
                    const subject = new Subject({
                        metadata: this.metadata,
                        entity: event.entity,
                        databaseEntity: previousEntity,
                    });

                    // find changed columns - if we have them
                    new SubjectChangedColumnsComputer().compute([subject]);
                    if (subject.changeMaps.length > 0) {
                        this.manager
                            .find(this.metadata.target, this.options as any)
                            .then(entities => {
                                this.subscriptionObserver.next(entities);
                            });
                    }
                }
            } else {

                this.manager.find(this.metadata.target, this.options as any).then(entities => {

                    let hasChange = false;
                    entities.forEach(entity => {
                        const previousEntity = this.lastEmitEntities.find(previousEntity => {
                            return this.metadata.compareEntities(entity, previousEntity);
                        });
                        if (previousEntity) {
                            const subject = new Subject({
                                metadata: this.metadata,
                                entity: entity,
                                databaseEntity: previousEntity,
                            });

                            // find changed columns - if we have them
                            new SubjectChangedColumnsComputer().compute([subject]);
                            if (subject.changeMaps.length > 0) {
                                hasChange = true;
                                subject.changeMaps.forEach(changeMap => {
                                    if (changeMap.column) {
                                        changeMap.column.setEntityValue(previousEntity, changeMap.value);
                                    } else if (changeMap.relation) {
                                        changeMap.relation.setEntityValue(previousEntity, changeMap.value);
                                    }
                                });
                            }
                        }
                    });

                    // if we have any new entity emit a new event
                    if (hasChange) {
                        this.subscriptionObserver.next(this.lastEmitEntities);
                    }
                });

            }
        },
        afterRemove: event => {
            if (!this.subscriptionObserver || !this.isSubscriberActive)
                return;

            // if something is removed we have to check:
            // - if entity with id was removed we check if its that entity
            // - if entity by query was removed we do execute original query again and differ

            if (event.entityId) {
                const previousEntity = this.lastEmitEntities.find(entity => {
                    return this.metadata.compareEntities(entity, this.metadata.ensureEntityIdMap(event.entityId));
                });
                if (previousEntity) {
                    this.lastEmitEntities.splice(this.lastEmitEntities.indexOf(previousEntity), 1);
                    this.subscriptionObserver.next(this.lastEmitEntities);
                }
            } else {
                this.manager.find(this.metadata.target, this.options as any).then(entities => {

                    let hasChange = false;
                    this.lastEmitEntities.forEach(previousEntity => {
                        const entity = entities.find(entity => {
                            return this.metadata.compareEntities(previousEntity, entity);
                        });

                        if (!entity) {
                            hasChange = true;
                            this.lastEmitEntities.splice(this.lastEmitEntities.indexOf(previousEntity), 1);
                        }
                    });

                    // if we have any new entity emit a new event
                    if (hasChange) {
                        this.subscriptionObserver.next(this.lastEmitEntities);
                    }
                });

            }
        }
    };

}