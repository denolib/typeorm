import {ConnectionOptionsReader} from "../connection/ConnectionOptionsReader.ts";
import {CommandUtils} from "./CommandUtils.ts";
import {camelCase} from "../util/StringUtils.ts";
import {Connection} from "../connection/Connection.ts";
import {ConnectionOptions} from "../connection/ConnectionOptions.ts";
import {CommandBuilder, CommandModule, Args} from "./CliBuilder.ts";
import * as colors from "../../vendor/https/deno.land/std/fmt/colors.ts";
import {process} from "../../vendor/https/deno.land/std/node/process.ts";
import {MOD_URL} from "../version.ts";

/**
 * Creates a new migration file.
 */
export class MigrationCreateCommand implements CommandModule {

    command = "migration:create";
    describe = "Creates a new migration file.";
    aliases = "migrations:create";

    builder(args: CommandBuilder) {
        return args
            .option("c", {
                alias: "connection",
                default: "default",
                describe: "Name of the connection on which run a query."
            })
            .option("n", {
                alias: "name",
                describe: "Name of the migration class.",
                demand: true
            })
            .option("d", {
                alias: "dir",
                describe: "Directory where migration should be created."
            })
            .option("f", {
                alias: "config",
                default: "ormconfig",
                describe: "Name of the file with connection configuration."
            });
    }

    async handler(args: Args) {
        if (args._[0] === "migrations:create") {
            console.log("'migrations:create' is deprecated, please use 'migration:create' instead");
        }

        try {
            const timestamp = new Date().getTime();
            const fileContent = MigrationCreateCommand.getTemplate(args.name as any, timestamp);
            const filename = timestamp + "-" + args.name + ".ts";
            let directory = args.dir;

            // if directory is not set then try to open tsconfig and find default path there
            if (!directory) {
                try {
                    const connectionOptionsReader = new ConnectionOptionsReader({
                        root: process.cwd(),
                        configName: args.config as any
                    });
                    const connectionOptions = await connectionOptionsReader.get(args.connection as any);
                    directory = connectionOptions.cli ? connectionOptions.cli.migrationsDir : undefined;
                } catch (err) { }
            }

            const path = process.cwd() + "/" + (directory ? (directory + "/") : "") + filename;
            await CommandUtils.createFile(path, fileContent);
            console.log(`Migration ${colors.blue(path)} has been generated successfully.`);

        } catch (err) {
            console.log(colors.black(colors.bgRed("Error during migration creation:")));
            console.error(err);
            process.exit(1);
        }
    }

    // -------------------------------------------------------------------------
    // Protected Static Methods
    // -------------------------------------------------------------------------

    /**
     * Gets contents of the migration file.
     */
    protected static getTemplate(name: string, timestamp: number): string {
        // @see https://github.com/denoland/deno/issues/4464
        return "import {MigrationInterface, QueryRunner} from \"" + MOD_URL + "\""; + `

export class ${camelCase(name, true)}${timestamp} implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
`;
    }

}
