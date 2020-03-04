import {Driver} from "../../driver/Driver.ts";
import {RelationIdLoadResult} from "../relation-id/RelationIdLoadResult.ts";
import {ObjectLiteral} from "../../common/ObjectLiteral.ts";
import {ColumnMetadata} from "../../metadata/ColumnMetadata.ts";
import {Alias} from "../Alias.ts";
import {RelationCountLoadResult} from "../relation-count/RelationCountLoadResult.ts";
import {RelationMetadata} from "../../metadata/RelationMetadata.ts";
import {OrmUtils} from "../../util/OrmUtils.ts";
import {QueryExpressionMap} from "../QueryExpressionMap.ts";
import {EntityMetadata} from "../../metadata/EntityMetadata.ts";
import {QueryRunner} from "../../index.ts";
import {DriverUtils} from "../../driver/DriverUtils.ts";

/**
 * Transforms raw sql results returned from the database into entity object.
 * Entity is constructed based on its entity metadata.
 */
export class RawSqlResultsToEntityTransformer {

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(protected expressionMap: QueryExpressionMap,
                protected driver: Driver,
                protected rawRelationIdResults: RelationIdLoadResult[],
                protected rawRelationCountResults: RelationCountLoadResult[],
                protected queryRunner?: QueryRunner) {
    }

    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------

    /**
     * Since db returns a duplicated rows of the data where accuracies of the same object can be duplicated
     * we need to group our result and we must have some unique id (primary key in our case)
     */
    transform(rawResults: any[], alias: Alias): any[] {
        const group = this.group(rawResults, alias);
        const entities: any[] = [];
        group.forEach(results => {
            const entity = this.transformRawResultsGroup(results, alias);
            if (entity !== undefined)
                entities.push(entity);
        });
        return entities;
    }

    // -------------------------------------------------------------------------
    // Protected Methods
    // -------------------------------------------------------------------------

    /**
     * Groups given raw results by ids of given alias.
     */
    protected group(rawResults: any[], alias: Alias): Map<string, any[]> {
        const map = new Map();
        const keys: string[] = [];
        if (alias.metadata.tableType === "view") {
            keys.push(...alias.metadata.columns.map(column => DriverUtils.buildColumnAlias(this.driver, alias.name, column.databaseName)));
        } else {
            keys.push(...alias.metadata.primaryColumns.map(column => DriverUtils.buildColumnAlias(this.driver, alias.name, column.databaseName)));
        }
        rawResults.forEach(rawResult => {
            const id = keys.map(key => {
                const keyValue = rawResult[key];

                if (false/*Buffer.isBuffer(keyValue)*/) {
                    return keyValue.toString("hex");
                }

                return keyValue;
            }).join("_"); // todo: check partial
            if (!id) return;

            const items = map.get(id);
            if (!items) {
                map.set(id, [rawResult]);
            } else {
                items.push(rawResult);
            }
        });
        return map;
    }

    /**
     * Transforms set of data results into single entity.
     */
    protected transformRawResultsGroup(rawResults: any[], alias: Alias): ObjectLiteral|undefined {
        // let hasColumns = false; // , hasEmbeddedColumns = false, hasParentColumns = false, hasParentEmbeddedColumns = false;
        let metadata = alias.metadata;

        if (metadata.discriminatorColumn) {
            const discriminatorValues = rawResults.map(result => result[DriverUtils.buildColumnAlias(this.driver, alias.name, alias.metadata.discriminatorColumn!.databaseName)]);
            const discriminatorMetadata = metadata.childEntityMetadatas.find(childEntityMetadata => {
                return !!discriminatorValues.find(value => value === childEntityMetadata.discriminatorValue);
            });
            if (discriminatorMetadata)
                metadata = discriminatorMetadata;
        }
        let entity: any = this.expressionMap.options.indexOf("create-pojo") !== -1 ? {} : metadata.create(this.queryRunner);

        // get value from columns selections and put them into newly created entity
        const hasColumns = this.transformColumns(rawResults, alias, entity, metadata);
        const hasRelations = this.transformJoins(rawResults, entity, alias, metadata);
        const hasRelationIds = this.transformRelationIds(rawResults, alias, entity, metadata);
        const hasRelationCounts = this.transformRelationCounts(rawResults, alias, entity);

        // if we have at least one selected column then return this entity
        // since entity must have at least primary columns to be really selected and transformed into entity
        if (hasColumns)
            return entity;

        // if we don't have any selected column we should not return entity,
        // except for the case when entity only contain a primary column as a relation to another entity
        // in this case its absolutely possible our entity to not have any columns except a single relation
        const hasOnlyVirtualPrimaryColumns = metadata.primaryColumns.filter(column => column.isVirtual === false).length === 0; // todo: create metadata.hasOnlyVirtualPrimaryColumns
        if (hasOnlyVirtualPrimaryColumns && (hasRelations || hasRelationIds || hasRelationCounts))
            return entity;

        return undefined;
    }

    // get value from columns selections and put them into object
    protected transformColumns(rawResults: any[], alias: Alias, entity: ObjectLiteral, metadata: EntityMetadata): boolean {
        let hasData = false;
        metadata.columns.forEach(column => {

            // if table inheritance is used make sure this column is not child's column
            if (metadata.childEntityMetadatas.length > 0 && metadata.childEntityMetadatas.map(metadata => metadata.target).indexOf(column.target) !== -1)
                return;

            const value = rawResults[0][DriverUtils.buildColumnAlias(this.driver, alias.name, column.databaseName)];
            if (value === undefined || column.isVirtual)
                return;

            // if user does not selected the whole entity or he used partial selection and does not select this particular column
            // then we don't add this column and its value into the entity
            if (!this.expressionMap.selects.find(select => select.selection === alias.name || select.selection === alias.name + "." + column.propertyPath))
                return;

            column.setEntityValue(entity, this.driver.prepareHydratedValue(value, column));
            if (value !== null) // we don't mark it as has data because if we will have all nulls in our object - we don't need such object
                hasData = true;
        });
        return hasData;
    }

    /**
     * Transforms joined entities in the given raw results by a given alias and stores to the given (parent) entity
     */
    protected transformJoins(rawResults: any[], entity: ObjectLiteral, alias: Alias, metadata: EntityMetadata) {
        let hasData = false;

        // let discriminatorValue: string = "";
        // if (metadata.discriminatorColumn)
        //     discriminatorValue = rawResults[0][DriverUtils.buildColumnAlias(this.connection.driver, alias.name, alias.metadata.discriminatorColumn!.databaseName)];

        this.expressionMap.joinAttributes.forEach(join => { // todo: we have problem here - when inner joins are used without selects it still create empty array

            // skip joins without metadata
            if (!join.metadata)
                return;

            // if simple left or inner join was performed without selection then we don't need to do anything
            if (!join.isSelected)
                return;

            // this check need to avoid setting properties than not belong to entity when single table inheritance used. (todo: check if we still need it)
            // const metadata = metadata.childEntityMetadatas.find(childEntityMetadata => discriminatorValue === childEntityMetadata.discriminatorValue);
            if (join.relation && !metadata.relations.find(relation => relation === join.relation))
                return;

            // some checks to make sure this join is for current alias
            if (join.mapToProperty) {
                if (join.mapToPropertyParentAlias !== alias.name)
                    return;
            } else {
                if (!join.relation || join.parentAlias !== alias.name || join.relationPropertyPath !== join.relation!.propertyPath)
                    return;
            }

            // transform joined data into entities
            let result: any = this.transform(rawResults, join.alias);
            result = !join.isMany ? result[0] : result;
            result = !join.isMany && result === undefined ? null : result; // this is needed to make relations to return null when its joined but nothing was found in the database
            if (result === undefined) // if nothing was joined then simply return
                return;

            // if join was mapped to some property then save result to that property
            if (join.mapToPropertyPropertyName) {
                entity[join.mapToPropertyPropertyName] = result; // todo: fix embeds

            } else { // otherwise set to relation
                join.relation!.setEntityValue(entity, result);
            }

            hasData = true;
        });
        return hasData;
    }

    protected transformRelationIds(rawSqlResults: any[], alias: Alias, entity: ObjectLiteral, metadata: EntityMetadata): boolean {
        let hasData = false;
        this.rawRelationIdResults.forEach(rawRelationIdResult => {
            if (rawRelationIdResult.relationIdAttribute.parentAlias !== alias.name)
                return;

            const relation = rawRelationIdResult.relationIdAttribute.relation;
            const valueMap = this.createValueMapFromJoinColumns(relation, rawRelationIdResult.relationIdAttribute.parentAlias, rawSqlResults);
            if (valueMap === undefined || valueMap === null)
                return;

            const idMaps = rawRelationIdResult.results.map(result => {
                const entityPrimaryIds = this.extractEntityPrimaryIds(relation, result);
                if (EntityMetadata.compareIds(entityPrimaryIds, valueMap) === false)
                    return;

                let columns: ColumnMetadata[];
                if (relation.isManyToOne || relation.isOneToOneOwner) {
                    columns = relation.joinColumns.map(joinColumn => joinColumn);
                } else if (relation.isOneToMany || relation.isOneToOneNotOwner) {
                    columns = relation.inverseEntityMetadata.primaryColumns.map(joinColumn => joinColumn);
                    // columns = relation.inverseRelation!.joinColumns.map(joinColumn => joinColumn.referencedColumn!); //.inverseEntityMetadata.primaryColumns.map(joinColumn => joinColumn);
                } else { // ManyToMany
                    if (relation.isOwning) {
                        columns = relation.inverseJoinColumns.map(joinColumn => joinColumn);
                    } else {
                        columns = relation.inverseRelation!.joinColumns.map(joinColumn => joinColumn);
                    }
                }

                const idMap = columns.reduce((idMap, column) => {
                    let value = result[column.databaseName];
                    if (relation.isOneToMany || relation.isOneToOneNotOwner) {
                        if (column.referencedColumn) // if column is a relation
                            value = column.referencedColumn.createValueMap(value);

                        return OrmUtils.mergeDeep(idMap, column.createValueMap(value));
                    } else {
                        if (column.referencedColumn!.referencedColumn) // if column is a relation
                            value = column.referencedColumn!.referencedColumn!.createValueMap(value);

                        return OrmUtils.mergeDeep(idMap, column.referencedColumn!.createValueMap(value));
                    }
                }, {} as ObjectLiteral);

                if (columns.length === 1 && rawRelationIdResult.relationIdAttribute.disableMixedMap === false) {
                    if (relation.isOneToMany || relation.isOneToOneNotOwner) {
                        return columns[0].getEntityValue(idMap);
                    } else {
                        return columns[0].referencedColumn!.getEntityValue(idMap);
                    }
                }
                return idMap;
            }).filter(result => result);


            const properties = rawRelationIdResult.relationIdAttribute.mapToPropertyPropertyPath.split(".");
            const mapToProperty = (properties: string[], map: ObjectLiteral, value: any): any => {

                const property = properties.shift();
                if (property && properties.length === 0) {
                    map[property] = value;
                    return map;
                } else if (property && properties.length > 0) {
                    mapToProperty(properties, map[property], value);
                } else {
                    return map;
                }
            };
            if (relation.isOneToOne || relation.isManyToOne) {
                if (idMaps[0] !== undefined) {
                    mapToProperty(properties, entity, idMaps[0]);
                    hasData = true;
                }
            } else {
                mapToProperty(properties, entity, idMaps);
                if (idMaps.length > 0) {
                    hasData = true;
                }
            }
        });

        return hasData;
    }

    protected transformRelationCounts(rawSqlResults: any[], alias: Alias, entity: ObjectLiteral): boolean {
        let hasData = false;
        this.rawRelationCountResults
            .filter(rawRelationCountResult => rawRelationCountResult.relationCountAttribute.parentAlias === alias.name)
            .forEach(rawRelationCountResult => {
                const relation = rawRelationCountResult.relationCountAttribute.relation;
                let referenceColumnName: string;

                if (relation.isOneToMany) {
                    referenceColumnName = relation.inverseRelation!.joinColumns[0].referencedColumn!.databaseName;  // todo: fix joinColumns[0]

                } else {
                    referenceColumnName = relation.isOwning ? relation.joinColumns[0].referencedColumn!.databaseName : relation.inverseRelation!.joinColumns[0].referencedColumn!.databaseName;
                }

                const referenceColumnValue = rawSqlResults[0][DriverUtils.buildColumnAlias(this.driver, alias.name, referenceColumnName)]; // we use zero index since its grouped data // todo: selection with alias for entity columns wont work
                if (referenceColumnValue !== undefined && referenceColumnValue !== null) {
                    entity[rawRelationCountResult.relationCountAttribute.mapToPropertyPropertyName] = 0;
                    rawRelationCountResult.results
                        .filter(result => result["parentId"] === referenceColumnValue)
                        .forEach(result => {
                            entity[rawRelationCountResult.relationCountAttribute.mapToPropertyPropertyName] = parseInt(result["cnt"]);
                            hasData = true;
                        });
                }
            });

        return hasData;
    }

    private createValueMapFromJoinColumns(relation: RelationMetadata, parentAlias: string, rawSqlResults: any[]): ObjectLiteral {
        let columns: ColumnMetadata[];
        if (relation.isManyToOne || relation.isOneToOneOwner) {
            columns = relation.entityMetadata.primaryColumns.map(joinColumn => joinColumn);
        } else if (relation.isOneToMany || relation.isOneToOneNotOwner) {
            columns = relation.inverseRelation!.joinColumns.map(joinColumn => joinColumn);
        } else {
            if (relation.isOwning) {
                columns = relation.joinColumns.map(joinColumn => joinColumn);
            } else {
                columns = relation.inverseRelation!.inverseJoinColumns.map(joinColumn => joinColumn);
            }
        }
        return columns.reduce((valueMap, column) => {
            rawSqlResults.forEach(rawSqlResult => {
                if (relation.isManyToOne || relation.isOneToOneOwner) {
                    valueMap[column.databaseName] = this.driver.prepareHydratedValue(rawSqlResult[DriverUtils.buildColumnAlias(this.driver, parentAlias, column.databaseName)], column);
                } else {
                    valueMap[column.databaseName] =  this.driver.prepareHydratedValue(rawSqlResult[DriverUtils.buildColumnAlias(this.driver, parentAlias, column.referencedColumn!.databaseName)], column);
                }
            });
            return valueMap;
        }, {} as ObjectLiteral);

    }

    private extractEntityPrimaryIds(relation: RelationMetadata, relationIdRawResult: any) {
        let columns: ColumnMetadata[];
        if (relation.isManyToOne || relation.isOneToOneOwner) {
            columns = relation.entityMetadata.primaryColumns.map(joinColumn => joinColumn);
        } else if (relation.isOneToMany || relation.isOneToOneNotOwner) {
            columns = relation.inverseRelation!.joinColumns.map(joinColumn => joinColumn);
        } else {
            if (relation.isOwning) {
                columns = relation.joinColumns.map(joinColumn => joinColumn);
            } else {
                columns = relation.inverseRelation!.inverseJoinColumns.map(joinColumn => joinColumn);
            }
        }
        return columns.reduce((data, column) => {
            data[column.databaseName] = relationIdRawResult[column.databaseName];
            return data;
        }, {} as ObjectLiteral);
    }

    /*private removeVirtualColumns(entity: ObjectLiteral, alias: Alias) {
        const virtualColumns = this.expressionMap.selects
            .filter(select => select.virtual)
            .map(select => select.selection.replace(alias.name + ".", ""));

        virtualColumns.forEach(virtualColumn => delete entity[virtualColumn]);
    }*/

}
