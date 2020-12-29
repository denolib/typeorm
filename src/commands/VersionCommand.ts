import {VERSION, BASE_TYPEORM_VERSION} from "../version.ts";
import type * as yargs from "./types.ts";

/**
 * Shows typeorm version.
 */
export class VersionCommand implements yargs.CommandModule {
    command = "version";
    describe = "Prints TypeORM version this project uses.";

    async handler() {

        console.log("TypeORM CLI version:", VERSION);
        console.log("Base TypeORM version:", BASE_TYPEORM_VERSION);
    }

}
