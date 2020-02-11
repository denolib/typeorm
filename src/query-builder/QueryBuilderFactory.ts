import {SelectQueryBuilder} from "./SelectQueryBuilder.ts";
import {InsertQueryBuilder} from "./InsertQueryBuilder.ts";
import {UpdateQueryBuilder} from "./UpdateQueryBuilder.ts";
import {DeleteQueryBuilder} from "./DeleteQueryBuilder.ts";
import {RelationQueryBuilder} from "./RelationQueryBuilder.ts";
import {QueryBuilder} from "./QueryBuilder.ts";
import {AbstractQueryBuilderFactory} from "./AbstractQueryBuilderFactory.ts";
import {Connection} from "../connection/Connection.ts";
import {QueryRunner} from "../query-runner/QueryRunner.ts";

export class QueryBuilderFactory implements AbstractQueryBuilderFactory {
    create<T extends QueryBuilder<any>>(queryBuilder: T, connection: Connection, queryRunner?: QueryRunner): T {
        return new (queryBuilder.constructor as any)(this, connection, queryRunner);
    }

    select(queryBuilder: QueryBuilder<any>): SelectQueryBuilder<any> {
        return queryBuilder instanceof SelectQueryBuilder
            ? queryBuilder
            : new SelectQueryBuilder(this, queryBuilder);
    }

    insert(queryBuilder: QueryBuilder<any>): InsertQueryBuilder<any> {
        return queryBuilder instanceof InsertQueryBuilder
            ? queryBuilder
            : new InsertQueryBuilder(this, queryBuilder);
    }

    update(queryBuilder: QueryBuilder<any>): UpdateQueryBuilder<any> {
        return queryBuilder instanceof UpdateQueryBuilder
            ? queryBuilder
            : new UpdateQueryBuilder(this, queryBuilder);
    }

    delete(queryBuilder: QueryBuilder<any>): DeleteQueryBuilder<any> {
        return queryBuilder instanceof DeleteQueryBuilder
            ? queryBuilder
            : new DeleteQueryBuilder(this, queryBuilder);
    }

    relation(queryBuilder: QueryBuilder<any>): RelationQueryBuilder<any> {
        return queryBuilder instanceof RelationQueryBuilder
            ? queryBuilder
            : new RelationQueryBuilder(this, queryBuilder);
    }

    clone<T extends QueryBuilder<any>>(queryBuilder: T): T {
        return new (queryBuilder.constructor as any)(this, queryBuilder);
    }
}
