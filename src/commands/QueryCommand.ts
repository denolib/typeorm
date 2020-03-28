import {createConnection} from "../index.ts";
import {QueryRunner} from "../query-runner/QueryRunner.ts";
import {ConnectionOptionsReader} from "../connection/ConnectionOptionsReader.ts";
import {Connection} from "../connection/Connection.ts";
import {PlatformTools} from "../platform/PlatformTools.ts";
import {CommandModule, CommandBuilder, Args} from "./CliBuilder.ts";
import * as colors from "../../vendor/https/deno.land/std/fmt/colors.ts";
import { process } from "../../vendor/https/deno.land/std/node/process.ts";


/**
 * Executes an sql query on the given connection.
 */
export class QueryCommand implements CommandModule {
    command = "query";
    describe = "Executes given SQL query on a default connection. Specify connection name to run query on a specific connection.";

    builder(args: CommandBuilder) {
        return args
            .option("c", {
                alias: "connection",
                default: "default",
                describe: "Name of the connection on which to run a query."
            })
            .option("f", {
                alias: "config",
                default: "ormconfig",
                describe: "Name of the file with connection configuration."
            });
    }

    async handler(args: Args) {
        let connection: Connection|undefined = undefined;
        let queryRunner: QueryRunner|undefined = undefined;
        try {

            // create a connection
            const connectionOptionsReader = new ConnectionOptionsReader({
                root: process.cwd(),
                configName: args.config as any
            });
            const connectionOptions = {
                ...await connectionOptionsReader.get(args.connection as any),
                synchronize: false,
                migrationsRun: false,
                dropSchema: false,
                logging: false
            };
            connection = await createConnection(connectionOptions);

            // create a query runner and execute query using it
            queryRunner = connection.createQueryRunner("master");
            console.log(colors.green("Running query: ") + PlatformTools.highlightSql(args._[1]));
            const queryResult = await queryRunner.query(args._[1]);
            console.log(colors.green("Query has been executed. Result: "));
            console.log(PlatformTools.highlightJson(JSON.stringify(queryResult, undefined, 2)));

            await queryRunner.release();
            await connection.close();

        } catch (err) {
            if (queryRunner) await (queryRunner as QueryRunner).release();
            if (connection) await (connection as Connection).close();

            console.log(colors.black(colors.bgRed("Error during query execution:")));
            console.error(err);
            process.exit(1);
        }
    }
}
