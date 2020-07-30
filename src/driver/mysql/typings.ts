// TODO(#79) We want to generate this file automatically.
export interface ExecuteResult {
    lastInsertId?: number;
    rows?: Rows;
}
export type Rows = Array<any>;

export type DenoMysql = {
    Client: ClientConstructor;
}

interface ClientConstructor {
    new(): Client;
}

export interface ClientConfig {
}

export interface Client {
    connect(config: ClientConfig): Promise<Client>;
    close(): Promise<void>;
    useConnection(callback: (connection: Connection) => Promise<void>): Promise<void>;
}

export interface Connection {
    execute(query: string, parameters: any[]): Promise<ExecuteResult>
}
