import {PlatformTools} from "../../platform/PlatformTools.ts";
import {ConnectionOptions} from "../ConnectionOptions.ts";

/**
 * Reads connection options defined in the yml file.
 */
export class ConnectionOptionsYmlReader {

    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------

    /**
     * Reads connection options from given yml file.
     */
    async read(path: string): Promise<ConnectionOptions[]> {
        type StdYaml = {
            parse(content: string): { [name: string]: ConnectionOptions };
        };
        const ymlParser = await PlatformTools.load<StdYaml>("js-yaml");
        const decoder = new TextDecoder();
        const config = ymlParser.parse(decoder.decode(PlatformTools.readFileSync(path)));
        return Object.keys(config).map(connectionName => {
            return Object.assign({ name: connectionName }, config[connectionName]);
        });
    }

}
