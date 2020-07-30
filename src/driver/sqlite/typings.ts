// TODO(#79) We want to generate this file automatically.
export type DenoSqlite = {
    DB: DBConstructor;
};
export interface DBConstructor {
    new(database?: string): DB;
}
export interface DB {
    close(): void;
    query(sql: string, ...params: any[]): Rows;
    lastInsertRowId: number;
}

export interface Rows {
  [Symbol.iterator](): Iterator<any[]>;
  columns(): Array<{ name: string }>
}

