import {createConnection} from "../index.ts";
import {ConnectionOptionsReader} from "../connection/ConnectionOptionsReader.ts";
import {Connection} from "../connection/Connection.ts";
import {ConnectionOptions} from "../connection/ConnectionOptions.ts";
import {CommandBuilder, CommandModule, Args} from "./CliBuilder.ts";
import * as colors from "../../vendor/https/deno.land/std/fmt/colors.ts";
import {process} from "../../vendor/https/deno.land/std/node/process.ts";

/**
 * Runs migration command.
 */
export class MigrationShowCommand implements CommandModule {

  command = "migration:show";
  describe = "Show all migrations and whether they have been run or not";

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
        logging: ["query", "error", "schema"]
      } as ConnectionOptions;
      connection = await createConnection(connectionOptions);
      const unappliedMigrations = await connection.showMigrations();
      await connection.close();

      // return error code if there are unapplied migrations for CI
      process.exit(unappliedMigrations ? 1 : 0);

    } catch (err) {
      if (connection) await (connection as Connection).close();

      console.log(colors.black(colors.bgRed("Error during migration show:")));
      console.error(err);
      process.exit(1);
    }
  }

}
