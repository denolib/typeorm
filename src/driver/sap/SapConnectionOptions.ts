import {BaseConnectionOptions} from "../../connection/BaseConnectionOptions.ts";
import {SapConnectionCredentialsOptions} from "./SapConnectionCredentialsOptions.ts";

/**
 * SAP Hana specific connection options.
 */
export interface SapConnectionOptions extends BaseConnectionOptions, SapConnectionCredentialsOptions {

    /**
     * Database type.
     */
    readonly type: "sap";

    /**
     * Database schema.
     */
    readonly schema?: string;

}
