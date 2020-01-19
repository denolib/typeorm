import {AbstractSqliteDriver} from "../sqlite-abstract/AbstractSqliteDriver.ts";
import {ExpoConnectionOptions} from "./ExpoConnectionOptions.ts";
import {ExpoQueryRunner} from "./ExpoQueryRunner.ts";
import {QueryRunner} from "../../query-runner/QueryRunner.ts";
import {Connection} from "../../connection/Connection.ts";
import {DriverOptionNotSetError} from "../../error/DriverOptionNotSetError.ts";
import {DriverPackageNotInstalledError} from "../../error/DriverPackageNotInstalledError.ts";

// needed for typescript compiler
interface Window {
    Expo: any;
}
declare const window: Window;

export class ExpoDriver extends AbstractSqliteDriver {
    options: ExpoConnectionOptions;
    
    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(connection: Connection) {
        super(connection);

        this.database = this.options.database;

        // validate options to make sure everything is set
        if (!this.options.database)
            throw new DriverOptionNotSetError("database");

        // load sqlite package
        this.loadDependencies();
    }
    

    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------

    /**
     * Closes connection with database.
     */
    async disconnect(): Promise<void> {
        return new Promise<void>((ok, fail) => {
            try {
                this.queryRunner = undefined;
                this.databaseConnection = undefined;
                ok();
            } catch (error) {
                fail(error);
            }
        });
    }
    
    /**
     * Creates a query runner used to execute database queries.
     */
    createQueryRunner(mode: "master"|"slave" = "master"): QueryRunner {
        if (!this.queryRunner)
            this.queryRunner = new ExpoQueryRunner(this);

        return this.queryRunner;
    }
    
    // -------------------------------------------------------------------------
    // Protected Methods
    // -------------------------------------------------------------------------

    /**
     * Creates connection with the database.
     */
    protected createDatabaseConnection() {
        return new Promise<void>((ok, fail) => {
            try {
                const databaseConnection = this.sqlite.openDatabase(this.options.database);
                /*
                // we need to enable foreign keys in sqlite to make sure all foreign key related features
                // working properly. this also makes onDelete work with sqlite.
                */
                databaseConnection.transaction((tsx: any) => {
                    tsx.executeSql(`PRAGMA foreign_keys = ON;`, [], (t: any, result: any) => {
                        ok(databaseConnection);
                    }, (t: any, err: any) => {
                        fail({transaction: t, error: err});
                    });
                }, (err: any) => {
                    fail(err);
                });
            } catch (error) {
                fail(error);
            }
        });
    }

    /**
     * If driver dependency is not given explicitly, then try to load it via "require".
     */
    protected loadDependencies(): void {
        try {
            this.sqlite = window.Expo.SQLite;
        } catch (e) {
            throw new DriverPackageNotInstalledError("Expo", "expo");
        }
    }
}
