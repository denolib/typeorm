import {FindManyOptions, FindOptionsOrder, FindOptionsSelect, FindOptionsWhere} from "./FindOptions";
import {Connection, EntityMetadata, ObjectLiteral, ObjectType, SelectQueryBuilder} from "..";
import {RelationMetadata} from "../metadata/RelationMetadata";

export class FindOptionsBuilder<E> {

    protected options: FindManyOptions<E>;
    protected mainMetadata: EntityMetadata;
    protected mainAlias: string;
    protected queryBuilder: SelectQueryBuilder<E>;
    protected loaded: { relation: RelationMetadata }[];

    protected selects: string[] = [];
    protected joins: { type: "inner"|"left", alias: string, parentAlias: string, relationMetadata: RelationMetadata, select: boolean }[] = [];
    protected conditions: string[] = [];
    protected orderBys: { alias: string, direction: "ASC"|"DESC", nulls?: "NULLS FIRST"|"NULLS LAST" }[] = [];
    protected parameters: ObjectLiteral = {};

    constructor(connection: Connection, entity: ObjectType<E>, options: FindManyOptions<E>) {
        this.options = options;
        this.mainMetadata = connection.entityMetadatas.find(metadata => metadata.target === entity)!;
        this.mainAlias = this.mainMetadata.targetName;
        this.queryBuilder = connection.createQueryBuilder(entity, this.mainAlias, options.options && options.options.queryRunner ? options.options.queryRunner : undefined);
    }

    build<E>() {
        if (this.options.select)
            this.buildSelect(this.options.select, this.mainMetadata, this.mainAlias);

        if (this.options.where)
            this.buildWhere(this.options.where, this.mainMetadata, this.mainAlias);

        if (this.options.order)
            this.buildOrder(this.options.order, this.mainMetadata, this.mainAlias);

        // add selects
        if (this.selects.length)
            this.queryBuilder.select(this.selects);

        // apply joins
        if (this.joins.length) {
            this.joins.forEach(join => {
                if (join.select) {
                    if (join.type === "inner") {
                        this.queryBuilder.innerJoinAndSelect(`${join.parentAlias}.${join.relationMetadata.propertyPath}`, join.alias);
                    } else {
                        this.queryBuilder.leftJoinAndSelect(`${join.parentAlias}.${join.relationMetadata.propertyPath}`, join.alias);
                    }
                } else {
                    if (join.type === "inner") {
                        this.queryBuilder.innerJoin(`${join.parentAlias}.${join.relationMetadata.propertyPath}`, join.alias);
                    } else {
                        this.queryBuilder.leftJoin(`${join.parentAlias}.${join.relationMetadata.propertyPath}`, join.alias);
                    }
                }
            });
        }

        // apply where expression
        if (this.conditions.length)
            this.queryBuilder.where(this.conditions.join(" AND "));

        // apply offset
        if (this.options.skip !== undefined) {
            if (this.options.options && this.options.options.pagination === false) {
                this.queryBuilder.offset(this.options.skip);
            } else {
                this.queryBuilder.skip(this.options.skip);
            }
        }

        // apply limit
        if (this.options.take !== undefined) {
            if (this.options.options && this.options.options.pagination === false) {
                this.queryBuilder.limit(this.options.take);
            } else {
                this.queryBuilder.take(this.options.take);
            }
        }

        // apply caching options
        if (typeof this.options.cache === "number") {
            this.queryBuilder.cache(this.options.cache);

        } else if (typeof this.options.cache === "boolean") {
            this.queryBuilder.cache(this.options.cache);

        } else if (typeof this.options.cache === "object") {
            this.queryBuilder.cache(this.options.cache.id, this.options.cache.milliseconds);
        }

        if (this.orderBys.length) {
            this.orderBys.forEach(orderBy => {
                this.queryBuilder.addOrderBy(orderBy.alias, orderBy.direction, orderBy.nulls);
            });
        }

        // todo
        // if (this.options.options && this.options.options.eagerRelations) {
        //     this.queryBuilder
        // }

        if (this.options.options && this.options.options.listeners === false) {
            this.queryBuilder.callListeners(false);
        }

        // set all registered parameters
        this.queryBuilder.setParameters(this.parameters);

        return this.queryBuilder;
    }

    protected buildSelect(select: FindOptionsSelect<any>, metadata: EntityMetadata, alias: string, embedPrefix?: string) {

        if (select instanceof Array) {
            select.forEach(select => {
                this.selects.push(this.mainAlias + "." + select);
            });

        } else {
            for (let key in select) {
                if (select[key] === undefined)
                    continue;

                const propertyPath = embedPrefix ? embedPrefix + "." + key : key;
                const column = metadata.findColumnWithPropertyPathStrict(propertyPath);
                const embed = metadata.findEmbeddedWithPropertyPath(propertyPath);
                const relation = metadata.findRelationWithPropertyPath(propertyPath);

                if (!embed && !column && !relation)
                    throw new Error(`Property "${propertyPath}" was not found in ${metadata.targetName}. Make sure your query is correct.`);

                if (column) {
                    this.selects.push(alias + "." + propertyPath);

                } else if (embed) {
                    this.buildSelect(select[key] as FindOptionsOrder<any>, metadata, alias, key);

                // } else if (relation) {
                //     const joinAlias = alias + "_" + relation.propertyName;
                //     const existJoin = this.joins.find(join => join.alias === joinAlias);
                //     if (!existJoin) {
                //         this.joins.push({
                //             type: "left",
                //             select: false,
                //             alias: joinAlias,
                //             parentAlias: alias,
                //             relationMetadata: relation
                //         });
                //     }
                //     this.buildOrder(select[key] as FindOptionsOrder<any>, relation.inverseEntityMetadata, joinAlias);
                }
            }
        }
    }

    protected buildOrder(order: FindOptionsOrder<any>, metadata: EntityMetadata, alias: string, embedPrefix?: string) {
        for (let key in order) {
            if (order[key] === undefined)
                continue;

            const propertyPath = embedPrefix ? embedPrefix + "." + key : key;
            const column = metadata.findColumnWithPropertyPathStrict(propertyPath);
            const embed = metadata.findEmbeddedWithPropertyPath(propertyPath);
            const relation = metadata.findRelationWithPropertyPath(propertyPath);

            if (!embed && !column && !relation)
                throw new Error(`Property "${propertyPath}" was not found in ${metadata.targetName}. Make sure your query is correct.`);

            if (column) {

                let direction = order[key] instanceof Object ? (order[key] as any).direction : order[key];
                direction = direction === "DESC" || direction === "desc" || direction === -1 ? "DESC" : "ASC";
                let nulls = order[key] instanceof Object ? (order[key] as any).nulls : undefined;
                nulls = nulls === "first" ? "NULLS FIRST" : nulls === "last" ? "NULLS LAST" : undefined;

                this.orderBys.push({ alias: alias + "." + propertyPath, direction, nulls }); // `${alias}.${propertyPath} = :${paramName}`);

            } else if (embed) {
                this.buildOrder(order[key] as FindOptionsOrder<any>, metadata, alias, key);

            } else if (relation) {
                const joinAlias = alias + "_" + relation.propertyName;
                const existJoin = this.joins.find(join => join.alias === joinAlias);
                if (!existJoin) {
                    this.joins.push({
                        type: "left",
                        select: false,
                        alias: joinAlias,
                        parentAlias: alias,
                        relationMetadata: relation
                    });
                }
                this.buildOrder(order[key] as FindOptionsOrder<any>, relation.inverseEntityMetadata, joinAlias);
            }
        }
    }

    protected buildWhere(where: FindOptionsWhere<any>, metadata: EntityMetadata, alias: string, embedPrefix?: string) {
        for (let key in where) {
            if (where[key] === undefined)
                continue;

            const propertyPath = embedPrefix ? embedPrefix + "." + key : key;
            const column = metadata.findColumnWithPropertyPathStrict(propertyPath);
            const embed = metadata.findEmbeddedWithPropertyPath(propertyPath);
            const relation = metadata.findRelationWithPropertyPath(propertyPath);

            if (!embed && !column && !relation)
                throw new Error(`Property "${propertyPath}" was not found in ${metadata.targetName}. Make sure your query is correct.`);

            if (column) {

                const paramName = alias + "_" + propertyPath.replace(".", "_");
                this.conditions.push(`${alias}.${propertyPath} = :${paramName}`);
                this.parameters[paramName] = where[key]; // todo: handle functions and other edge cases

            } else if (embed) {
                this.buildWhere(where[key], metadata, alias, key);

            } else if (relation) {
                const joinAlias = alias + "_" + relation.propertyName;
                const existJoin = this.joins.find(join => join.alias === joinAlias);
                if (!existJoin) {
                    this.joins.push({
                        type: "inner",
                        select: false,
                        alias: joinAlias,
                        parentAlias: alias,
                        relationMetadata: relation
                    });
                } else {
                    if (existJoin.type === "left")
                        existJoin.type = "inner";
                }
                this.buildWhere(where[key], relation.inverseEntityMetadata, joinAlias);
            }
        }
    }

}