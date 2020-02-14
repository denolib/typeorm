import {DB, save} from "../../../vendor/https/deno.land/x/sqlite/mod.ts";
import {QueryRunnerAlreadyReleasedError} from "../../error/QueryRunnerAlreadyReleasedError.ts";
import {QueryFailedError} from "../../error/QueryFailedError.ts";
import {AbstractSqliteQueryRunner} from "../sqlite-abstract/AbstractSqliteQueryRunner.ts";
import {SqliteDriver} from "./SqliteDriver.ts";
import {Broadcaster} from "../../subscriber/Broadcaster.ts";
import {SqlUtils} from "../../util/SqlUtils.ts";

/**
 * Runs queries on a single sqlite database connection.
 *
 * Does not support compose primary keys with autoincrement field.
 * todo: need to throw exception for this case.
 */
export class SqliteQueryRunner extends AbstractSqliteQueryRunner {

    /**
     * Database driver used by connection.
     */
    driver: SqliteDriver;

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(driver: SqliteDriver) {
        super();
        this.driver = driver;
        this.connection = driver.connection;
        this.broadcaster = new Broadcaster(this);
    }

    /**
     * Executes a given SQL query.
     */
    async query(query: string, parameters?: any[]): Promise<any> {
        if (this.isReleased)
            throw new QueryRunnerAlreadyReleasedError();

        const connection = this.driver.connection;
        const reportSlowQuery = function (): void {

            // log slow queries if maxQueryExecution time is set
            const maxQueryExecutionTime = connection.options.maxQueryExecutionTime;
            const queryEndTime = +new Date();
            const queryExecutionTime = queryEndTime - queryStartTime;
            if (maxQueryExecutionTime && queryExecutionTime > maxQueryExecutionTime)
                connection.logger.logQuerySlow(queryExecutionTime, query, parameters, this);
        };

        const run = () => {
            if (isInsertQuery) {
                databaseConnection.query(query, parameters || []);
                const lastID = this.getLastInsertRowID(databaseConnection);
                reportSlowQuery();
                return lastID;
            } else {
                const rows = databaseConnection.query(query, parameters || []);
                reportSlowQuery();
                return this.convertRowsIntoArray(rows, query);
            }
        };

        const databaseConnection = (await this.connect()) as DB;
        this.driver.connection.logger.logQuery(query, parameters, this);
        const queryStartTime = +new Date();
        const isInsertQuery = SqlUtils.isInsertQuery(query);
        try {
            const result = run();
            await this.saveDatabaseToFileIfNeeded(databaseConnection, query);
            return result;
        } catch (err) {
            connection.logger.logQueryError(err, query, parameters, this);
            throw new QueryFailedError(query, parameters, err);
        }
    }

    // TODO(uki00a) Optimize this method.
    private async saveDatabaseToFileIfNeeded(databaseConnection: DB, executedQuery: string): Promise<void> {
        if (this.driver.isInMemory()) {
            return;
        }

        // FIXME(uki00a) I'm not sure if this is correct or not.
        if (SqlUtils.isCommitQuery(executedQuery)) {
            this.connection.logger.log("info", "Saving database to file...", this);
            await save(databaseConnection);
            return;
        }

        const hasSideEffects = !SqlUtils.isSelectQuery(executedQuery);
        if (hasSideEffects && !this.isTransactionActive) {
            this.connection.logger.log("info", "Saving database to file...", this);
            await save(databaseConnection);
        }
    }

    private getLastInsertRowID(databaseConnection: DB): unknown {
        const query = "SELECT last_insert_rowid()";
        this.connection.logger.logQuery(query, [], this);
        const rows = databaseConnection.query(query);
        for (const [lastID] of rows) {
            rows.done();
            return lastID;
        }
    }

    private convertRowsIntoArray(rows: ReturnType<DB['query']>, executedQuery: string): unknown[] {
        const columnNames = this.extractColumns(rows);
        const array = [] as unknown[];
        for (const row of rows) {
            const converted = {};
            for (let columnIndex = 0; columnIndex < row.length; ++columnIndex) {
                const columnName = columnNames[columnIndex];
                const columnValue = row[columnIndex];
                converted[columnName] = columnValue;
            }
            array.push(converted);
        }
        return array;
    }

    private extractColumns(rows: ReturnType<DB['query']>): string[] {
        try {
            return rows.columns().map(column => column.name);
        } catch {
            return [];
        }
    }
}
