import * as DenoPostgres from "../../../vendor/https/deno.land/x/postgres/mod.ts";

type ResolvedType<T> = T extends Promise<infer U> ? U : never;
export type PoolClient = ResolvedType<ReturnType<DenoPostgres.Pool['connect']>>;
export type QueryResult = ResolvedType<ReturnType<DenoPostgres.Client['query']>>;
