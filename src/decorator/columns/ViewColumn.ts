import {getMetadataArgsStorage} from "../../index.ts";
import {ColumnMetadataArgs} from "../../metadata-args/ColumnMetadataArgs.ts";

/**
 * ViewColumn decorator is used to mark a specific class property as a view column.
 */
export function ViewColumn(): Function {
    return function (object: Object, propertyName: string) {
        getMetadataArgsStorage().columns.push({
            target: object.constructor,
            propertyName: propertyName,
            mode: "regular",
            options: {}
        } as ColumnMetadataArgs);
    };
}
