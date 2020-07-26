import type * as DenoSqlite from "../../../vendor/https/deno.land/x/sqlite/mod.ts";
import {ensureDir} from "../../util/fs.ts";
import {dirname} from "../../../vendor/https/deno.land/std/path/mod.ts";
import {SqliteQueryRunner} from "./SqliteQueryRunner.ts";
import {DriverOptionNotSetError} from "../../error/DriverOptionNotSetError.ts";
import {Connection} from "../../connection/Connection.ts";
import {SqliteConnectionOptions} from "./SqliteConnectionOptions.ts";
import {ColumnType} from "../types/ColumnTypes.ts";
import {QueryRunner} from "../../query-runner/QueryRunner.ts";
import {AbstractSqliteDriver} from "../sqlite-abstract/AbstractSqliteDriver.ts";

/**
 * Organizes communication with sqlite DBMS.
 *
 * This driver provides the same behavior as the original TypeORM's SqljsDriver.
 */
export class SqliteDriver extends AbstractSqliteDriver {

    // -------------------------------------------------------------------------
    // Public Properties
    // -------------------------------------------------------------------------

    /**
     * Connection options.
     */
    options: SqliteConnectionOptions;

    databaseConnection!: DenoSqlite.DB;

    sqlite!: typeof DenoSqlite;


    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(connection: Connection) {
        super(connection);

        this.connection = connection;
        this.options = connection.options as SqliteConnectionOptions;
        this.database = this.options.database;

        // validate options to make sure everything is set
        if (!this.options.database)
            throw new DriverOptionNotSetError("database");
    }

    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------

    /**
     * Closes connection with database.
     */
    async disconnect(): Promise<void> {
        this.queryRunner = undefined;
        try {
            this.databaseConnection.close();
        } catch (error) {
            if (error.code === 5) { // SqliteBusy
                // FIXME
                // This problem occurs since deno-sqlite@73935087a1ebe9108d784503bc5474662ba54b73.
                // We need more research...
                console.warn(error); // this.connection.logger.log("warn", error.message);
            } else {
                throw error;
            }
        }
    }

    /**
     * Creates a query runner used to execute database queries.
     */
    createQueryRunner(mode: "master"|"slave" = "master"): QueryRunner {
        if (!this.queryRunner)
            this.queryRunner = new SqliteQueryRunner(this);

        return this.queryRunner;
    }

    normalizeType(column: { type?: ColumnType, length?: number | string, precision?: number|null, scale?: number }): string {
        if ((column.type as any) === Uint8Array) {
            return "blob";
        }

        return super.normalizeType(column);
    }

    // TODO(uki00a) Make this method private or move to appropriate object
    isInMemory(): boolean {
        return this.database === ':memory:';
    }

    // -------------------------------------------------------------------------
    // Protected Methods
    // -------------------------------------------------------------------------

    /**
     * Creates connection with the database.
     */
    protected async createDatabaseConnection() {
        if (!this.isInMemory()) {
            await this.createDatabaseDirectory(this.options.database);
        }

        const databaseConnection = new this.sqlite.DB(this.options.database);

        // we need to enable foreign keys in sqlite to make sure all foreign key related features
        // working properly. this also makes onDelete to work with sqlite.
        databaseConnection.query(`PRAGMA foreign_keys = ON;`);

        // in the options, if encryption key for SQLCipher is setted.
        if (this.options.key) {
            databaseConnection.query(`PRAGMA key = ${JSON.stringify(this.options.key)};`);
        }

        return databaseConnection;
    }

    /**
     * If driver dependency is not given explicitly, then try to load it via "require".
     */
    protected async loadDependencies(): Promise<void> {
        this.sqlite = await import("../../../vendor/https/deno.land/x/sqlite/mod.ts");
    }

    /**
     * Auto creates database directory if it does not exist.
     */
    protected createDatabaseDirectory(fullPath: string): Promise<void> {
        return ensureDir(dirname(fullPath));
    }
}
