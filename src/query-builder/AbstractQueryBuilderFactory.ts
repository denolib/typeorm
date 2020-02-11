import {SelectQueryBuilder} from "./SelectQueryBuilder.ts";
import {InsertQueryBuilder} from "./InsertQueryBuilder.ts";
import {UpdateQueryBuilder} from "./UpdateQueryBuilder.ts";
import {DeleteQueryBuilder} from "./DeleteQueryBuilder.ts";
import {RelationQueryBuilder} from "./RelationQueryBuilder.ts";
import {QueryBuilder} from "./QueryBuilder.ts";
import {Connection} from "../connection/Connection.ts";
import {QueryRunner} from "../query-runner/QueryRunner.ts";

/**
 * The reason I have this interface is to avoid circular references between `*QueryBuilder`s
 */
export interface AbstractQueryBuilderFactory {
    create<T extends QueryBuilder<any>>(queryBuilder: T, connection: Connection, queryRunner?: QueryRunner): T;
    select(queryBuilder: QueryBuilder<any>): SelectQueryBuilder<any>;
    insert(queryBuilder: QueryBuilder<any>): InsertQueryBuilder<any>;
    update(queryBuilder: QueryBuilder<any>): UpdateQueryBuilder<any>;
    delete(queryBuilder: QueryBuilder<any>): DeleteQueryBuilder<any>;
    relation(queryBuilder: QueryBuilder<any>): RelationQueryBuilder<any>;
    clone<T extends QueryBuilder<any>>(queryBuilder: T): T;
}
