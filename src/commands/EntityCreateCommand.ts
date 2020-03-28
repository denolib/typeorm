import {ConnectionOptionsReader} from "../connection/ConnectionOptionsReader.ts";
import {CommandUtils} from "./CommandUtils.ts";
import {CommandBuilder, CommandModule, Args} from "./CliBuilder.ts";
import {MOD_URL} from "../version.ts";
import * as colors from "../../vendor/https/deno.land/std/fmt/colors.ts";
import {process} from "../../vendor/https/deno.land/std/node/process.ts";

/**
 * Generates a new entity.
 */
export class EntityCreateCommand implements CommandModule {
    command = "entity:create";
    describe = "Generates a new entity.";

    builder(args: CommandBuilder) {
        return args
            .option("c", {
                alias: "connection",
                default: "default",
                describe: "Name of the connection on which to run a query"
            })
            .option("n", {
                alias: "name",
                describe: "Name of the entity class.",
                demand: true
            })
            .option("d", {
                alias: "dir",
                describe: "Directory where entity should be created."
            })
            .option("f", {
                alias: "config",
                default: "ormconfig",
                describe: "Name of the file with connection configuration."
            });
    }

    async handler(args: Args) {
        try {
            const fileContent = EntityCreateCommand.getTemplate(args.name as any);
            const filename = args.name + ".ts";
            let directory = args.dir;

            // if directory is not set then try to open tsconfig and find default path there
            if (!directory) {
                try {
                    const connectionOptionsReader = new ConnectionOptionsReader({
                        root: process.cwd(),
                        configName: args.config as any
                    });
                    const connectionOptions = await connectionOptionsReader.get(args.connection as any);
                    directory = connectionOptions.cli ? connectionOptions.cli.entitiesDir : undefined;
                } catch (err) { }
            }

            const path = process.cwd() + "/" + (directory ? (directory + "/") : "") + filename;
            const fileExists = await CommandUtils.fileExists(path);
            if (fileExists) {
                throw `File ${colors.blue(path)} already exists`;
            }
            await CommandUtils.createFile(path, fileContent);
            console.log(colors.green(`Entity ${colors.blue(path)} has been created successfully.`));

        } catch (err) {
            console.log(colors.black(colors.bgRed("Error during entity creation:")));
            console.error(err);
            process.exit(1);
        }
    }

    // -------------------------------------------------------------------------
    // Protected Static Methods
    // -------------------------------------------------------------------------

    /**
     * Gets contents of the entity file.
     */
    protected static getTemplate(name: string): string {
        // @see https://github.com/denoland/deno/issues/4464
        return "import {Entity} from \"" + MOD_URL + "\";\n" + `

@Entity()
export class ${name} {

}
`;
    }

}
