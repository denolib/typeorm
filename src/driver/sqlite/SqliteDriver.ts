import {open, save, DB} from "../../../vendor/https/deno.land/x/sqlite/mod.ts";
import {ensureDir} from "../../../vendor/https/deno.land/std/fs/mod.ts";
import {dirname} from "../../../vendor/https/deno.land/std/path/mod.ts";
import {SqliteQueryRunner} from "./SqliteQueryRunner.ts";
import {DriverOptionNotSetError} from "../../error/DriverOptionNotSetError.ts";
import {Connection} from "../../connection/Connection.ts";
import {SqliteConnectionOptions} from "./SqliteConnectionOptions.ts";
import {ColumnType} from "../types/ColumnTypes.ts";
import {QueryRunner} from "../../query-runner/QueryRunner.ts";
import {PlatformTools} from "../../platform/PlatformTools.ts";
import {AbstractSqliteDriver} from "../sqlite-abstract/AbstractSqliteDriver.ts";
import type {AutoSavableDriver} from "../types/AutoSavable.ts";
import {NotImplementedError} from "../../error/NotImplementedError.ts";

/**
 * Organizes communication with sqlite DBMS.
 *
 * This driver provides the same behavior as the original TypeORM's SqljsDriver.
 */
export class SqliteDriver extends AbstractSqliteDriver implements AutoSavableDriver {

    // -------------------------------------------------------------------------
    // Public Properties
    // -------------------------------------------------------------------------

    /**
     * Connection options.
     */
    options: SqliteConnectionOptions;

    databaseConnection!: DB;

    /**
     * This method is simply copied from `SqljsDriver#load`
     *
     * Loads a database from a given file (Deno), local storage key (browser) or array.
     * This will delete the current database!
     */
    async load(fileNameOrLocalStorageOrData: string | Uint8Array, checkIfFileOrLocalStorageExists: boolean = true): Promise<any> {
        if (typeof fileNameOrLocalStorageOrData === "string") {
            // content has to be loaded
            if (PlatformTools.type === "deno") {
                // Node.js
                // fileNameOrLocalStorageOrData should be a path to the file
                if (checkIfFileOrLocalStorageExists && !PlatformTools.fileExist(fileNameOrLocalStorageOrData)) {
                    throw new Error(`File ${fileNameOrLocalStorageOrData} does not exist`);
                }

                // TODO(uki00a) Should we disconnect from current database if exists?
                this.databaseConnection = await this.createDatabaseConnectionWithImport(fileNameOrLocalStorageOrData);
            }
            else {
                // browser
                // fileNameOrLocalStorageOrData should be a local storage / indexedDB key
                throw new NotImplementedError("SqliteDriver#load");
                /*
                let localStorageContent = null;
                if (this.options.useLocalForage) {
                    if (window.localforage) {
                        localStorageContent = await window.localforage.getItem(fileNameOrLocalStorageOrData);
                    } else {
                        throw new Error(`localforage is not defined - please import localforage.js into your site`);
                    }
                } else {
                    localStorageContent = PlatformTools.getGlobalVariable().localStorage.getItem(fileNameOrLocalStorageOrData);
                }

                if (localStorageContent != null) {
                    // localStorage value exists.
                    return this.createDatabaseConnectionWithImport(JSON.parse(localStorageContent));
                }
                else if (checkIfFileOrLocalStorageExists) {
                    throw new Error(`File ${fileNameOrLocalStorageOrData} does not exist`);
                }
                else {
                    // localStorage value doesn't exist and checkIfFileOrLocalStorageExists is set to false.
                    // Therefore open a database without importing anything.
                    // localStorage value will be written on first write operation.
                    return this.createDatabaseConnectionWithImport();
                }
                */
            }
        }
        else {
            throw new NotImplementedError("SqliteDriver#load does not currently support Uint8Array");
            // return this.createDatabaseConnectionWithImport(fileNameOrLocalStorageOrData);
        }
    }

    /**
     * This method is simply copied from SqljsDriver#autoSave.
     */
    async autoSave(): Promise<void> {
        if (this.options.autoSave) {
            if (this.options.autoSaveCallback) {
                await this.options.autoSaveCallback(this.databaseConnection.data());
            }
            else {
                await this.save();
            }
        }
    }

    async save(location?: string): Promise<void> {
        if (location) {
            return this.saveToLocation(location);
        }

        if (this.isInMemory()) {
            return;
        }

        save(this.databaseConnection);
    }

    /**
     * Returns the current database as Uint8Array.
     */
    export(): Uint8Array {
        return this.databaseConnection.data();
    }

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
        return this.createDatabaseConnectionWithImport(this.options.database);
    }

    /**
     * Creates connection with a database.
     * If database is specified it is loaded, otherwise a new empty database is created.
     */
    protected async createDatabaseConnectionWithImport(database: string) {
        if (!this.isInMemory()) {
            await this.createDatabaseDirectory(database);
        }

        const databaseConnection = await open(database, true);

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
    protected loadDependencies(): void {
        // TODO(uki00a) Remove this method.
    }

    /**
     * Auto creates database directory if it does not exist.
     */
    protected createDatabaseDirectory(fullPath: string): Promise<void> {
        return ensureDir(dirname(fullPath));
    }

    private async saveToLocation(location: string) {
        if (PlatformTools.type === "deno") {
            try {
                const content = this.export();
                await PlatformTools.writeFile(location, content);
            }
            catch (e) {
                throw new Error(`Could not save database, error: ${e}`);
            }
        } else {
            throw new NotImplementedError("SqliteDriver does not currently support browser");
            /*
            const database: Uint8Array = this.databaseConnection.export();
            // convert Uint8Array to number array to improve local-storage storage
            const databaseArray = [].slice.call(database);
            if (this.options.useLocalForage) {
                if (window.localforage) {
                    await window.localforage.setItem(path, JSON.stringify(databaseArray));
                } else {
                    throw new Error(`localforage is not defined - please import localforage.js into your site`);
                }
            } else {
                PlatformTools.getGlobalVariable().localStorage.setItem(path, JSON.stringify(databaseArray));
            }
            */
        }
    }
}
