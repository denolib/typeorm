import {CommandBuilder, CommandModule, Args} from "./CliBuilder.ts";
import {VERSION, BASE_TYPEORM_VERSION} from "../version.ts";

/**
 * Shows typeorm version.
 */
export class VersionCommand implements CommandModule {
    command = "version";
    describe = "Prints TypeORM version this project uses.";

    async handler() {

        console.log("TypeORM CLI version:", VERSION);
        console.log("Base TypeORM version:", BASE_TYPEORM_VERSION);
    }

}
