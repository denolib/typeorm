import {FindManyOptions, FindOptionsWhere} from "./FindOptions";
import {Connection, EntityMetadata, ObjectLiteral, ObjectType, SelectQueryBuilder} from "..";
import {RelationMetadata} from "../metadata/RelationMetadata";

export class FindOptionsBuilder<E> {

    protected options: FindManyOptions<E>;
    protected mainMetadata: EntityMetadata;
    protected mainAlias: string;
    protected queryBuilder: SelectQueryBuilder<E>;
    protected loaded: { relation: RelationMetadata }[];

    protected selects: string[] = [];
    protected joins: { alias: string, parentAlias: string, relationMetadata: RelationMetadata, select: boolean }[] = [];
    protected conditions: string[] = [];
    protected parameters: ObjectLiteral = {};

    constructor(connection: Connection, entity: ObjectType<E>, options: FindManyOptions<E>) {
        this.options = options;
        this.mainMetadata = connection.entityMetadatas.find(metadata => metadata.target === entity)!;
        this.mainAlias = this.mainMetadata.targetName;
        this.queryBuilder = connection.createQueryBuilder(entity, this.mainAlias);
    }

    build<E>() {
        this.select();

        if (this.options.where)
            this.where(this.options.where, this.mainMetadata, this.mainAlias);

        if (this.selects.length)
            this.queryBuilder.addSelect(this.selects);
        if (this.joins.length) {
            this.joins.forEach(join => {
                if (join.select) {
                    this.queryBuilder.innerJoinAndSelect(`${join.parentAlias}.${join.relationMetadata.propertyPath}`, join.alias);
                } else {
                    this.queryBuilder.innerJoin(`${join.parentAlias}.${join.relationMetadata.propertyPath}`, join.alias);
                }
            });
        }
        if (this.conditions.length)
            this.queryBuilder.where(this.conditions.join(" AND "));

        this.queryBuilder.setParameters(this.parameters);
        return this.queryBuilder;
    }

    protected select() {
        if (!this.options.select)
            return;

        if (this.options.select instanceof Array) {
            this.options.select.forEach(select => {
                this.selects.push(this.mainAlias + "." + select);
            });

        } else {
            for (let key in this.options.select) {

                const column = this.mainMetadata.findColumnWithPropertyPath(key);
                const embed = this.mainMetadata.findEmbeddedWithPropertyPath(key);
                const relation = this.mainMetadata.findRelationWithPropertyPath(key);
                if (!embed && !column && !relation)
                    throw new Error(`${key} was not found`);

                if (column) {
                    if (this.options.select[key] === true) {
                        this.selects.push(this.mainAlias + "." + key);
                    }
                } else if (embed) {

                } else if (relation) {

                }

            }
        }
    }

    protected where(where: FindOptionsWhere<any>, metadata: EntityMetadata, alias: string, embedPrefix?: string) {
        for (let key in where) {

            const propertyPath = embedPrefix ? embedPrefix + "." + key : key;
            const column = metadata.findColumnWithPropertyPathStrict(propertyPath);
            const embed = metadata.findEmbeddedWithPropertyPath(propertyPath);
            const relation = metadata.findRelationWithPropertyPath(propertyPath);

            if (!embed && !column && !relation)
                throw new Error(`Property "${propertyPath}" was not found in ${metadata.targetName}. Make sure your query is correct.`);

            if (column) {
                if (where[key] === undefined)
                    continue;

                const paramName = alias + "_" + propertyPath.replace(".", "_");
                this.conditions.push(`${alias}.${propertyPath} = :${paramName}`);
                this.parameters[paramName] = where[key]; // todo: handle functions and other edge cases

            } else if (embed) {
                this.where(where[key], metadata, alias, key);

            } else if (relation) {
                const joinAlias = alias + "_" + relation.propertyName;
                this.joins.push({
                    select: false,
                    alias: joinAlias,
                    parentAlias: alias,
                    relationMetadata: relation
                });
                this.where(where[key], relation.inverseEntityMetadata, joinAlias);
            }
        }
    }

}