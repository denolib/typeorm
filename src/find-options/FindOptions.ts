import {FindOperator} from "./FindOperator";
import {QueryRunner} from "..";

/**
 * Value of order by in find options.
 */
export type FindOptionsOrderByValue = "ASC" | "DESC" | "asc" | "desc" | 1 | -1 | {
    direction?: "asc"|"desc"|"ASC"|"DESC";
    nulls?: "first"|"last"|"FIRST"|"LAST";
};

/**
 * Order by find options.
 */
export type FindOptionsOrderBy<E> = {
    [P in keyof E]?:
        E[P] extends (infer R)[] ? FindOptionsOrderBy<R> :
        E[P] extends object ? FindOptionsOrderBy<E[P]> :
        FindOptionsOrderByValue;
};

/**
 * Relations find options.
 */
export type FindOptionsRelation<E> = {
    [P in keyof E]?:
        E[P] extends (infer R)[] ? FindOptionsRelation<R> | boolean :
        E[P] extends object ? FindOptionsRelation<E[P]> | boolean :
        boolean;
};

/**
 * Select find options.
 */
export type FindOptionsSelect<E> = {
    [P in keyof E]?:
        E[P] extends (infer R)[] ? FindOptionsSelect<R> | boolean :
        E[P] extends object ? FindOptionsSelect<E[P]> | boolean :
        boolean;
};

/**
 * Where and Having find options.
 */
export type FindOptionsWhere<E> = {
    [P in keyof E]?:
        E[P] extends any[] ? FindOptionsWhere<E[P][number]> :
        E[P] extends (infer R)[] ? FindOptionsWhere<R> :
        E[P] extends object ? FindOptionsWhere<E[P]> :
        FindOperator<E[P]>|E[P]
};

/**
 * Extra options that can be applied to FindOptions.
 */
export type FindExtraOptions = {

    /**
     * Indicates if eager relations should be loaded or not.
     * Enabled by default.
     */
    eagerRelations?: boolean;

    /**
     * Indicates if special pagination query shall be applied to the query
     * if skip or take in conjunction with joins is used.
     * Enabled by default.
     */
    pagination?: boolean;

    /**
     * Indicates if listeners must be executed before and after the query execution.
     * Enabled by default.
     */
    listeners?: boolean;

    /**
     * Uses provided query runner for query execution.
     */
    queryRunner?: QueryRunner;

};

/**
 * Advanced caching options for FindOptions.
 */
export type FindCacheOptions = {

    /**
     * Cache identifier.
     */
    id?: any;

    /**
     * Caching time in milliseconds.
     */
    milliseconds?: number;
};

/**
 * Set of criteria and options to return entities by.
 */
export type FindOptions<E> = {

    /**
     * Specifies what columns should be selected.
     * Used for partial selections.
     */
    select?: (keyof E)[]|FindOptionsSelect<E>;

    /**
     * Conditions that should be applied to match entities.
     */
    where?: FindOptionsWhere<E>;

    /**
     * Conditions that should be applied to match entities after data selection (using SQL's HAVING operator).
     */
    having?: FindOptionsWhere<E>;

    /**
     * Order, in which entities should be ordered.
     */
    orderBy?: FindOptionsOrderBy<E>;

    /**
     * Relations that needs to be joined and returned in a single SQL query.
     * If you have lot of data returned by your query then its more efficient to load it using relations instead of joins.
     */
    joins?: (keyof E)[]|FindOptionsRelation<E>;

    /**
     * Relations that needs to be loaded in a separate SQL queries.
     * If you have lot of data returned by your query then its more efficient to load it using relations instead of joins.
     */
    relations?: (keyof E)[]|FindOptionsRelation<E>;

    /**
     * Query caching options.
     * Disabled by default.
     * If set to true then caching is enabled based on global options.
     * You can also provide a number of milliseconds - caching time.
     */
    cache?: boolean | number | FindCacheOptions;

    /**
     * Extra options.
     */
    options?: FindExtraOptions;
};

/**
 * Find options for operators that return multiple entities.
 */
export type FindManyOptions<E> = FindOptions<E> & {

    /**
     * Offset (paginated) where from entities should be taken.
     */
    skip?: number;

    /**
     * Limit (paginated) - max number of entities should be taken.
     */
    take?: number;

};