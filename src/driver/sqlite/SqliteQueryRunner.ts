import {DB} from "../../../vendor/https/deno.land/x/sqlite/mod.ts";
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
     * Commits transaction.
     * Error will be thrown if transaction was not started.
     */
    async commitTransaction(): Promise<void> {
        await super.commitTransaction();
        await this.driver.autoSave();
    }



    /**
     * Executes a given SQL query.
     */
    async query(query: string, parameters?: any[]): Promise<any> {
        if (this.isReleased)
            throw new QueryRunnerAlreadyReleasedError();

        const connection = this.driver.connection;
        const reportSlowQuery = (): void => {

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
            return result;
        } catch (err) {
            connection.logger.logQueryError(err, query, parameters, this);
            throw new QueryFailedError(query, parameters, err);
        }
    }

    private getLastInsertRowID(databaseConnection: DB): unknown {
        const query = "SELECT last_insert_rowid()";
        this.connection.logger.logQuery(query, [], this);
        const rows = databaseConnection.query(query, []);
        for (const row of rows) {
            const [lastID] = row!;
            rows.done();
            return lastID;
        }
    }

    private convertRowsIntoArray(rows: ReturnType<DB['query']>, executedQuery: string): unknown[] {
        const columnNames = this.extractColumns(rows);
        const array = [] as unknown[];
        for (const row of rows) {
            const converted = {} as { [column: string]: any };
            for (let columnIndex = 0; columnIndex < row!.length; ++columnIndex) {
                const columnName = columnNames[columnIndex];
                const columnValue = row![columnIndex];
                converted[columnName] = columnValue;
            }
            array.push(converted);
        }
        return array;
    }

    private extractColumns(rows: ReturnType<DB['query']>): string[] {
        try {
            return rows.columns().map((column: { name: string }) => column.name);
        } catch {
            return [];
        }
    }
}
