import {createConnection} from "../index.ts";
import {ConnectionOptionsReader} from "../connection/ConnectionOptionsReader.ts";
import {Connection} from "../connection/Connection.ts";
import {ConnectionOptions} from "../connection/ConnectionOptions.ts";
import {CommandBuilder, CommandModule, Args} from "./CliBuilder.ts";
import * as colors from "../../vendor/https/deno.land/std/fmt/colors.ts";
import {process} from "../../vendor/https/deno.land/std/node/process.ts";

/**
 * Reverts last migration command.
 */
export class MigrationRevertCommand implements CommandModule {

    command = "migration:revert";
    describe = "Reverts last executed migration.";
    aliases = "migrations:revert";

    builder(args: CommandBuilder) {
        return args
            .option("c", {
                alias: "connection",
                default: "default",
                describe: "Name of the connection on which run a query."
            })
            .option("transaction", {
                alias: "t",
                default: "default",
                describe: "Indicates if transaction should be used or not for migration revert. Enabled by default."
            })
            .option("f", {
                alias: "config",
                default: "ormconfig",
                describe: "Name of the file with connection configuration."
            });
    }

    async handler(args: Args) {
        if (args._[0] === "migrations:revert") {
            console.log("'migrations:revert' is deprecated, please use 'migration:revert' instead");
        }

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
                logging: ["query", "error", "schema"]
            } as ConnectionOptions;
            connection = await createConnection(connectionOptions);

            const options = {
                transaction: "all" as "all" | "none" | "each",
            };

            switch (args.t) {
                case "all":
                    options.transaction = "all";
                    break;
                case "none":
                case "false":
                    options.transaction = "none";
                    break;
                case "each":
                    options.transaction = "each";
                    break;
                default:
                    // noop
            }

            await connection.undoLastMigration(options);
            await connection.close();

        } catch (err) {
            if (connection) await (connection as Connection).close();

            console.log(colors.black(colors.bgRed("Error during migration revert:")));
            console.error(err);
            process.exit(1);
        }
    }

}
