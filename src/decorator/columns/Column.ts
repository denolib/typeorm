import {ColumnOptions, getMetadataArgsStorage} from "../../index.ts";
import {
    ColumnType, SimpleColumnType, SpatialColumnType, WithLengthColumnType,
    WithPrecisionColumnType, WithWidthColumnType
} from "../../driver/types/ColumnTypes.ts";
import {ColumnMetadataArgs} from "../../metadata-args/ColumnMetadataArgs.ts";
import {ColumnCommonOptions} from "../options/ColumnCommonOptions.ts";
import {SpatialColumnOptions} from "../options/SpatialColumnOptions.ts";
import {ColumnWithLengthOptions} from "../options/ColumnWithLengthOptions.ts";
import {ColumnNumericOptions} from "../options/ColumnNumericOptions.ts";
import {ColumnEnumOptions} from "../options/ColumnEnumOptions.ts";
import {ColumnEmbeddedOptions} from "../options/ColumnEmbeddedOptions.ts";
import {EmbeddedMetadataArgs} from "../../metadata-args/EmbeddedMetadataArgs.ts";
import {ColumnTypeUndefinedError} from "../../error/ColumnTypeUndefinedError.ts";
import {ColumnHstoreOptions} from "../options/ColumnHstoreOptions.ts";
import {ColumnWithWidthOptions} from "../options/ColumnWithWidthOptions.ts";
import { GeneratedMetadataArgs } from "../../metadata-args/GeneratedMetadataArgs.ts";

/**
 * Column decorator is used to mark a specific class property as a table column.
 * Only properties decorated with this decorator will be persisted to the database when entity be saved.
 */
export function Column(options: ColumnOptions): Function;

/**
 * Column decorator is used to mark a specific class property as a table column.
 * Only properties decorated with this decorator will be persisted to the database when entity be saved.
 */
export function Column(type: SimpleColumnType, options?: ColumnCommonOptions): Function;

/**
 * Column decorator is used to mark a specific class property as a table column.
 * Only properties decorated with this decorator will be persisted to the database when entity be saved.
 */
export function Column(type: SpatialColumnType, options?: ColumnCommonOptions & SpatialColumnOptions): Function;

/**
 * Column decorator is used to mark a specific class property as a table column.
 * Only properties decorated with this decorator will be persisted to the database when entity be saved.
 */
export function Column(type: WithLengthColumnType, options?: ColumnCommonOptions & ColumnWithLengthOptions): Function;

/**
 * Column decorator is used to mark a specific class property as a table column.
 * Only properties decorated with this decorator will be persisted to the database when entity be saved.
 */
export function Column(type: WithWidthColumnType, options?: ColumnCommonOptions & ColumnWithWidthOptions): Function;

/**
 * Column decorator is used to mark a specific class property as a table column.
 * Only properties decorated with this decorator will be persisted to the database when entity be saved.
 */
export function Column(type: WithPrecisionColumnType, options?: ColumnCommonOptions & ColumnNumericOptions): Function;

/**
 * Column decorator is used to mark a specific class property as a table column.
 * Only properties decorated with this decorator will be persisted to the database when entity be saved.
 */
export function Column(type: "enum", options?: ColumnCommonOptions & ColumnEnumOptions): Function;

/**
 * Column decorator is used to mark a specific class property as a table column.
 * Only properties decorated with this decorator will be persisted to the database when entity be saved.
 */
export function Column(type: "simple-enum", options?: ColumnCommonOptions & ColumnEnumOptions): Function;

/**
 * Column decorator is used to mark a specific class property as a table column.
 * Only properties decorated with this decorator will be persisted to the database when entity be saved.
 */
export function Column(type: "set", options?: ColumnCommonOptions & ColumnEnumOptions): Function;

/**
 * Column decorator is used to mark a specific class property as a table column.
 * Only properties decorated with this decorator will be persisted to the database when entity be saved.
 */
export function Column(type: "hstore", options?: ColumnCommonOptions & ColumnHstoreOptions): Function;

/**
 * Column decorator is used to mark a specific class property as a table column.
 * Only properties decorated with this decorator will be persisted to the database when entity be saved.
 *
 * Property in entity can be marked as Embedded, and on persist all columns from the embedded are mapped to the
 * single table of the entity where Embedded is used. And on hydration all columns which supposed to be in the
 * embedded will be mapped to it from the single table.
 */
export function Column(type: (type?: any) => Function, options?: ColumnEmbeddedOptions): Function;

/**
 * Column decorator is used to mark a specific class property as a table column.
 * Only properties decorated with this decorator will be persisted to the database when entity be saved.
 */
export function Column(typeOrOptions: ((type?: any) => Function)|ColumnType|(ColumnOptions&ColumnEmbeddedOptions), options?: (ColumnOptions&ColumnEmbeddedOptions) | (ColumnCommonOptions&ColumnHstoreOptions)): Function {
    return function (object: Object, propertyName: string) {

        // normalize parameters
        let type: ColumnType|undefined;
        if (typeof typeOrOptions === "string" || typeOrOptions instanceof Function) {
            type = <ColumnType> typeOrOptions;

        } else if (typeOrOptions) {
            options = <ColumnOptions> typeOrOptions;
            type = typeOrOptions.type;
        }
        if (!options) options = {} as ColumnOptions;

        // check if there is no type in column options then set type from first function argument, or guessed one
        if (!(options as ColumnOptions).type && type)
            (options as ColumnOptions).type = type;

        // specify HSTORE type if column is HSTORE
        if ((options as ColumnOptions).type === "hstore" && !(options as ColumnOptions).hstoreType)
            (options as ColumnOptions).hstoreType = "string";

        if (typeOrOptions instanceof Function) { // register an embedded
            getMetadataArgsStorage().embeddeds.push({
                target: object.constructor,
                propertyName: propertyName,
                isArray: options.array === true,
                prefix: (options as ColumnEmbeddedOptions).prefix !== undefined ? (options as ColumnEmbeddedOptions).prefix : undefined,
                type: typeOrOptions as (type?: any) => Function
            } as EmbeddedMetadataArgs);

        } else { // register a regular column

            // if we still don't have a type then we need to give error to user that type is required
            if (!(options as ColumnOptions).type)
                throw new ColumnTypeUndefinedError(object, propertyName);

            // create unique
            if (options.unique === true)
                getMetadataArgsStorage().uniques.push({ target: object.constructor, columns: [propertyName] });

            getMetadataArgsStorage().columns.push({
                target: object.constructor,
                propertyName: propertyName,
                mode: "regular",
                options: options
            } as ColumnMetadataArgs);

            if (options.generated) {
                getMetadataArgsStorage().generations.push({
                    target: object.constructor,
                    propertyName: propertyName,
                    strategy: typeof options.generated === "string" ? options.generated : "increment"
                } as GeneratedMetadataArgs);
            }
        }
    };
}
