import type {Connection} from "../../../vendor/https/deno.land/x/mysql/mod.ts"

type ResolvedType<T> = T extends Promise<infer U> ? U : never;
export type ReleaseConnection = () => Promise<void>;
export type RawExecuteResult = ResolvedType<ReturnType<Connection["execute"]>>;
export type Rows = Array<any>;
export type QueryResult = Rows | RawExecuteResult;
