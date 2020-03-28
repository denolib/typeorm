import {createConnection} from "../index.ts";
import {Connection} from "../connection/Connection.ts";
import {ConnectionOptionsReader} from "../connection/ConnectionOptionsReader.ts";
import {ConnectionOptions} from "../connection/ConnectionOptions.ts";
import {PlatformTools} from "../platform/PlatformTools.ts";
import {CommandModule, CommandBuilder, Args} from "./CliBuilder.ts";
import * as colors from "../../vendor/https/deno.land/std/fmt/colors.ts";
import {process} from "../../vendor/https/deno.land/std/node/process.ts";

/**
 * Shows sql to be executed by schema:sync command.
 */
export class SchemaLogCommand implements CommandModule {

    command = "schema:log";
    describe = "Shows sql to be executed by schema:sync command. It shows sql log only for your default connection. " +
        "To run update queries on a concrete connection use -c option.";

    builder(args: CommandBuilder) {
        return args
            .option("c", {
                alias: "connection",
                default: "default",
                describe: "Name of the connection of which schema sync log should be shown."
            })
            .option("f", {
                alias: "config",
                default: "ormconfig",
                describe: "Name of the file with connection configuration."
            });
    }

    async handler(args: Args) {

        let connection: Connection|undefined = undefined;
        try {

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
            } as ConnectionOptions;
            connection = await createConnection(connectionOptions);
            const sqlInMemory = await connection.driver.createSchemaBuilder().log();
            if (sqlInMemory.upQueries.length === 0) {
                console.log(colors.yellow("Your schema is up to date - there are no queries to be executed by schema syncronization."));

            } else {
                const lengthSeparators = String(sqlInMemory.upQueries.length).split("").map(char => "-").join("");
                console.log(colors.yellow("---------------------------------------------------------------" + lengthSeparators));
                console.log(colors.yellow(colors.bold(`-- Schema syncronization will execute following sql queries (${colors.white(String(sqlInMemory.upQueries.length))}):`)));
                console.log(colors.yellow("---------------------------------------------------------------" + lengthSeparators));

                sqlInMemory.upQueries.forEach(upQuery => {
                    let sqlString = upQuery.query;
                    sqlString = sqlString.trim();
                    sqlString = sqlString.substr(-1) === ";" ? sqlString : sqlString + ";";
                    console.log(PlatformTools.highlightSql(sqlString));
                });
            }
            await connection.close();

        } catch (err) {
            if (connection)

            console.log(colors.black(colors.bgRed("Error during schema synchronization:")));
            console.error(err);
            process.exit(1);
        }
    }
}
