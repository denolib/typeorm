// TODO(#79) We want to generate this file automatically.
export type DenoPostgres = {
  Pool: PoolConstructor;
  Client: Client;
};

interface PoolConstructor {
    new(options: PoolOptions, maxSize: number, b: boolean): Pool;
}

type PoolOptions = {
    hostname: string;
    user: string;
    password: string;
    database: string;
    port: number;
    ssl: object;
}

export interface Pool {
    connect(): Promise<PoolClient>;
    end(): Promise<void>;
}

interface Client {
    query(): Promise<QueryResult>;
}

export interface PoolClient {
    query(query: string, ...params: any[]): Promise<QueryResult>;
    release(): Promise<void>;
}

export interface QueryResult {
    rows: Array<any[]>;
    rowCount?: number;
    rowDescription: {
        columnCount: number;
        columns: Array<{ name: string }>;
    };
    command: string;
}

