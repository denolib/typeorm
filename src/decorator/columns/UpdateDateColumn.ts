import {ColumnOptions, getMetadataArgsStorage} from "../../index.ts";
import {ColumnMetadataArgs} from "../../metadata-args/ColumnMetadataArgs.ts";

/**
 * This column will store an update date of the updated object.
 * This date is being updated each time you persist the object.
 */
export function UpdateDateColumn(options?: ColumnOptions): Function {
    return function (object: Object, propertyName: string) {

        getMetadataArgsStorage().columns.push({
            target: object.constructor,
            propertyName: propertyName,
            mode: "updateDate",
            options: options ? options : {}
        } as ColumnMetadataArgs);
    };
}

