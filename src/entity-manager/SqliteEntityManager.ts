// This code is simply copied from src/entity-manager/SqljsEntityManager.ts
import {Connection} from "../connection/Connection.ts";
import {QueryRunner} from "../query-runner/QueryRunner.ts";
import {EntityManager} from "./EntityManager.ts";
import {SqliteDriver} from "../driver/sqlite/SqliteDriver.ts";

/**
 * A special EntityManager that includes import/export and load/save function
 * that are unique to deno-sqlite.
 *
 * This class provides the same behavior as the original TypeORM's SqljsEntityManager.
 */
export class SqliteEntityManager extends EntityManager {
    private driver: SqliteDriver;

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(connection: Connection, queryRunner?: QueryRunner) {
        super(connection, queryRunner);
        this.driver = connection.driver as SqliteDriver;
    }

    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------

    /**
     * Loads either the definition from a file (Deno) or localstorage (browser)
     * or uses the given definition to open a new database.
     */
    async loadDatabase(fileNameOrLocalStorageOrData: string | Uint8Array): Promise<void> {
        await this.driver.load(fileNameOrLocalStorageOrData);
    }

    /**
     * Saves the current database to a file (Deno) or localstorage (browser)
     * if fileNameOrLocalStorage is not set options.location is used.
     */
    async saveDatabase(fileNameOrLocalStorage: string): Promise<void> {
        await this.driver.save(fileNameOrLocalStorage);
    }

    /**
     * Returns the current database definition.
     */
    exportDatabase(): Uint8Array {
        return this.driver.export();
    }

 }

