import {ConnectionOptionsReader} from "../connection/ConnectionOptionsReader.ts";
import {CommandUtils} from "./CommandUtils.ts";
import {ConnectionOptions} from "../connection/ConnectionOptions.ts";
import {CommandBuilder, CommandModule, Args} from "./CliBuilder.ts";
import * as colors from "../../vendor/https/deno.land/std/fmt/colors.ts";
import {process} from "../../vendor/https/deno.land/std/node/process.ts";
import {MOD_URL} from "../version.ts";

/**
 * Generates a new subscriber.
 */
export class SubscriberCreateCommand implements CommandModule {
    command = "subscriber:create";
    describe = "Generates a new subscriber.";

    builder(args: CommandBuilder) {
        return args
            .option("c", {
                alias: "connection",
                default: "default",
                describe: "Name of the connection on which to run a query"
            })
            .option("n", {
                alias: "name",
                describe: "Name of the subscriber class.",
                demand: true
            })
            .option("d", {
                alias: "dir",
                describe: "Directory where subscriber should be created."
            })
            .option("f", {
                alias: "config",
                default: "ormconfig",
                describe: "Name of the file with connection configuration."
            });
    }

    async handler(args: Args) {

        try {
            const fileContent = SubscriberCreateCommand.getTemplate(args.name as any);
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
                    directory = connectionOptions.cli ? connectionOptions.cli.subscribersDir : undefined;
                } catch (err) { }
            }

            const path = process.cwd() + "/" + (directory ? (directory + "/") : "") + filename;
            await CommandUtils.createFile(path, fileContent);
            console.log(colors.green(`Subscriber ${colors.blue(path)} has been created successfully.`));

        } catch (err) {
            console.log(colors.black(colors.bgRed("Error during subscriber creation:")));
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
        return "import {EventSubscriber, EntitySubscriberInterface} from \"" + MOD_URL + "\";" + `

@EventSubscriber()
export class ${name} implements EntitySubscriberInterface<any> {

}
`;
    }

}
