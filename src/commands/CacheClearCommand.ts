import {createConnection} from "../index.ts";
import {ConnectionOptionsReader} from "../connection/ConnectionOptionsReader.ts";
import {Connection} from "../connection/Connection.ts";
import {ConnectionOptions} from "../connection/ConnectionOptions.ts";
import {CommandBuilder, CommandModule, Args} from "./CliBuilder.ts";
import * as colors from "../../vendor/https/deno.land/std/fmt/colors.ts";
import {process} from "../../vendor/https/deno.land/std/node/process.ts";

/**
 * Clear cache command.
 */
export class CacheClearCommand implements CommandModule {

    command = "cache:clear";
    describe = "Clears all data stored in query runner cache.";

    builder(args: CommandBuilder) {
        return args
            .option("connection", {
                alias: "c",
                default: "default",
                describe: "Name of the connection on which run a query."
            })
            .option("config", {
                alias: "f",
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
                subscribers: [],
                synchronize: false,
                migrationsRun: false,
                dropSchema: false,
                logging: ["schema"]
            } as ConnectionOptions;
            connection = await createConnection(connectionOptions);

            if (!connection!.queryResultCache) {
                console.log(colors.black(colors.bgRed("Cache is not enabled. To use cache enable it in connection configuration.")));
                return;
            }

            await connection.queryResultCache.clear();
            console.log(colors.green("Cache was successfully cleared"));

            if (connection) await connection.close();

        } catch (err) {
            if (connection) await (connection as Connection).close();

            console.log(colors.black(colors.bgRed("Error during cache clear:")));
            console.error(err);
            process.exit(1);
        }
    }

}
