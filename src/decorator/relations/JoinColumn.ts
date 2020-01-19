import {getMetadataArgsStorage, JoinColumnOptions} from "../../index.ts";
import {JoinColumnMetadataArgs} from "../../metadata-args/JoinColumnMetadataArgs.ts";

/**
 * JoinColumn decorator used on one-to-one relations to specify owner side of relationship.
 * It also can be used on both one-to-one and many-to-one relations to specify custom column name
 * or custom referenced column.
 */
export function JoinColumn(): Function;

/**
 * JoinColumn decorator used on one-to-one relations to specify owner side of relationship.
 * It also can be used on both one-to-one and many-to-one relations to specify custom column name
 * or custom referenced column.
 */
export function JoinColumn(options: JoinColumnOptions): Function;

/**
 * JoinColumn decorator used on one-to-one relations to specify owner side of relationship.
 * It also can be used on both one-to-one and many-to-one relations to specify custom column name
 * or custom referenced column.
 */
export function JoinColumn(options: JoinColumnOptions[]): Function;

/**
 * JoinColumn decorator used on one-to-one relations to specify owner side of relationship.
 * It also can be used on both one-to-one and many-to-one relations to specify custom column name
 * or custom referenced column.
 */
export function JoinColumn(optionsOrOptionsArray?: JoinColumnOptions|JoinColumnOptions[]): Function {
    return function (object: Object, propertyName: string) {
        const options = optionsOrOptionsArray instanceof Array ? optionsOrOptionsArray : [optionsOrOptionsArray || {}];
        options.forEach(options => {
            getMetadataArgsStorage().joinColumns.push({
                target: object.constructor,
                propertyName: propertyName,
                name: options.name,
                referencedColumnName: options.referencedColumnName
            } as JoinColumnMetadataArgs);
        });
    };
}
