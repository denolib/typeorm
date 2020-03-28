import {CommandBuilder, CommandModule, Args} from "./CliBuilder.ts";
import {VERSION} from "../version.ts";

/**
 * Shows typeorm version.
 */
export class VersionCommand implements CommandModule {
    command = "version";
    describe = "Prints TypeORM version this project uses.";

    async handler() {

        console.log("TypeORM CLI version:", VERSION);
    }

}
