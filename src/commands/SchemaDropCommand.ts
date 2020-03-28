import {createConnection} from "../index.ts";
import {Connection} from "../connection/Connection.ts";
import {ConnectionOptionsReader} from "../connection/ConnectionOptionsReader.ts";
import {ConnectionOptions} from "../connection/ConnectionOptions.ts";
import {CommandModule, CommandBuilder, Args} from "./CliBuilder.ts";
import * as colors from "../../vendor/https/deno.land/std/fmt/colors.ts";
import {process} from "../../vendor/https/deno.land/std/node/process.ts";

/**
 * Drops all tables of the database from the given connection.
 */
export class SchemaDropCommand implements CommandModule {
    command = "schema:drop";
    describe = "Drops all tables in the database on your default connection. " +
        "To drop table of a concrete connection's database use -c option.";

    builder(args: CommandBuilder) {
        return args
            .option("c", {
                alias: "connection",
                default: "default",
                describe: "Name of the connection on which to drop all tables."
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
                logging: ["query", "schema"]
            } as ConnectionOptions;
            connection = await createConnection(connectionOptions);
            await connection.dropDatabase();
            await connection.close();

            console.log(colors.green("Database schema has been successfully dropped."));

        } catch (err) {
            if (connection) await (connection as Connection).close();

            console.log(colors.black(colors.bgRed("Error during schema drop:")));
            console.error(err);
            process.exit(1);
        }
    }
}
