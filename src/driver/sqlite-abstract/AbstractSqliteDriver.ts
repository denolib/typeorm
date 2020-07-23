import {Driver} from "../Driver.ts";
import {ObjectLiteral} from "../../common/ObjectLiteral.ts";
import {ColumnMetadata} from "../../metadata/ColumnMetadata.ts";
import {DateUtils} from "../../util/DateUtils.ts";
import {Connection} from "../../connection/Connection.ts";
import {RdbmsSchemaBuilder} from "../../schema-builder/RdbmsSchemaBuilder.ts";
import {MappedColumnTypes} from "../types/MappedColumnTypes.ts";
import {ColumnType} from "../types/ColumnTypes.ts";
import {QueryRunner} from "../../query-runner/QueryRunner.ts";
import {DataTypeDefaults} from "../types/DataTypeDefaults.ts";
import {TableColumn} from "../../schema-builder/table/TableColumn.ts";
import {BaseConnectionOptions} from "../../connection/BaseConnectionOptions.ts";
import {EntityMetadata} from "../../metadata/EntityMetadata.ts";
import {OrmUtils} from "../../util/OrmUtils.ts";
import {ApplyValueTransformers} from "../../util/ApplyValueTransformers.ts";

/**
 * Organizes communication with sqlite DBMS.
 */
export abstract class AbstractSqliteDriver implements Driver {

    // -------------------------------------------------------------------------
    // Public Properties
    // -------------------------------------------------------------------------

    /**
     * Connection used by driver.
     */
    connection: Connection;

    /**
     * Sqlite has a single QueryRunner because it works on a single database connection.
     */
    queryRunner?: QueryRunner;

    /**
     * Real database connection with sqlite database.
     */
    databaseConnection: any;

    // -------------------------------------------------------------------------
    // Public Implemented Properties
    // -------------------------------------------------------------------------

    /**
     * Connection options.
     */
    options: BaseConnectionOptions;

    /**
     * Master database used to perform all write queries.
     */
    database?: string;

    /**
     * Indicates if replication is enabled.
     */
    isReplicated: boolean = false;

    /**
     * SQLite underlying library.
     */
    sqlite: any;

    /**
     * Indicates if tree tables are supported by this driver.
     */
    treeSupport = true;

    /**
     * Gets list of supported column data types by a driver.
     *
     * @see https://www.tutorialspoint.com/sqlite/sqlite_data_types.htm
     * @see https://sqlite.org/datatype3.html
     */
    supportedDataTypes: ColumnType[] = [
        "int",
        "integer",
        "tinyint",
        "smallint",
        "mediumint",
        "bigint",
        "unsigned big int",
        "int2",
        "int8",
        "integer",
        "character",
        "varchar",
        "varying character",
        "nchar",
        "native character",
        "nvarchar",
        "text",
        "clob",
        "text",
        "blob",
        "real",
        "double",
        "double precision",
        "float",
        "real",
        "numeric",
        "decimal",
        "boolean",
        "date",
        "time",
        "datetime"
    ];

    /**
     * Gets list of column data types that support length by a driver.
     */
    withLengthColumnTypes: ColumnType[] = [
        "character",
        "varchar",
        "varying character",
        "nchar",
        "native character",
        "nvarchar",
        "text",
        "blob",
        "clob"
    ];

    /**
     * Gets list of spatial column data types.
     */
    spatialTypes: ColumnType[] = [];

    /**
     * Gets list of column data types that support precision by a driver.
     */
    withPrecisionColumnTypes: ColumnType[] = [];

    /**
     * Gets list of column data types that support scale by a driver.
     */
    withScaleColumnTypes: ColumnType[] = [];

    /**
     * Orm has special columns and we need to know what database column types should be for those types.
     * Column types are driver dependant.
     */
    mappedDataTypes: MappedColumnTypes = {
        createDate: "datetime",
        createDateDefault: "datetime('now')",
        updateDate: "datetime",
        updateDateDefault: "datetime('now')",
        version: "integer",
        treeLevel: "integer",
        migrationId: "integer",
        migrationName: "varchar",
        migrationTimestamp: "bigint",
        cacheId: "int",
        cacheIdentifier: "varchar",
        cacheTime: "bigint",
        cacheDuration: "int",
        cacheQuery: "text",
        cacheResult: "text",
        metadataType: "varchar",
        metadataDatabase: "varchar",
        metadataSchema: "varchar",
        metadataTable: "varchar",
        metadataName: "varchar",
        metadataValue: "text",
    };

    /**
     * Default values of length, precision and scale depends on column data type.
     * Used in the cases when length/precision/scale is not specified by user.
     */
    dataTypeDefaults!: DataTypeDefaults;

    /**
     * No documentation specifying a maximum length for identifiers could be found
     * for SQLite.
     */
    maxAliasLength?: number;

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(connection: Connection) {
        this.connection = connection;
        this.options = connection.options as BaseConnectionOptions;
    }

    // -------------------------------------------------------------------------
    // Public Abstract
    // -------------------------------------------------------------------------

    /**
     * Creates a query runner used to execute database queries.
     */
    abstract createQueryRunner(mode: "master"|"slave"): QueryRunner;

    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------

    /**
     * Performs connection to the database.
     */
    async connect(): Promise<void> {
        await this.loadDependencies();
        this.databaseConnection = await this.createDatabaseConnection();
    }

    /**
     * Makes any action after connection (e.g. create extensions in Postgres driver).
     */
    afterConnect(): Promise<void> {
        return Promise.resolve();
    }

    /**
     * Closes connection with database.
     */
    async disconnect(): Promise<void> {
        return new Promise<void>((ok, fail) => {
            this.queryRunner = undefined;
            this.databaseConnection.close((err: any) => err ? fail(err) : ok());
        });
    }

    /**
     * Creates a schema builder used to build and sync a schema.
     */
    createSchemaBuilder() {
        return new RdbmsSchemaBuilder(this.connection);
    }

    /**
     * Prepares given value to a value to be persisted, based on its column type and metadata.
     */
    preparePersistentValue(value: any, columnMetadata: ColumnMetadata): any {
        if (columnMetadata.transformer)
            value = ApplyValueTransformers.transformTo(columnMetadata.transformer, value);

        if (value === null || value === undefined)
            return value;

        if (columnMetadata.type === Boolean || columnMetadata.type === "boolean") {
            return value === true ? 1 : 0;

        } else if (columnMetadata.type === "date") {
            return DateUtils.mixedDateToDateString(value);

        } else if (columnMetadata.type === "time") {
            return DateUtils.mixedDateToTimeString(value);

        } else if (columnMetadata.type === "datetime" || columnMetadata.type === Date) {
            // to string conversation needs because SQLite stores date as integer number, when date came as Object
            // TODO: think about `toUTC` conversion
            return DateUtils.mixedDateToUtcDatetimeString(value);

        } else if (columnMetadata.type === "simple-array") {
            return DateUtils.simpleArrayToString(value);

        } else if (columnMetadata.type === "simple-json") {
            return DateUtils.simpleJsonToString(value);
        } else if (columnMetadata.type === "simple-enum") {
            return DateUtils.simpleEnumToString(value);
        }
        // Some types are treated differently from the original typeorm.
        else if (typeof value === "bigint") {
            // Unlike node-sqlite, deno-sqlite uses BigInt for large numbers.
            // https://github.com/dyedgreen/deno-sqlite/pull/67
            return value.toString();
        }

        return value;
    }

    /**
     * Prepares given value to a value to be hydrated, based on its column type or metadata.
     */
    prepareHydratedValue(value: any, columnMetadata: ColumnMetadata): any {
        if (value === null || value === undefined)
            return columnMetadata.transformer ? ApplyValueTransformers.transformFrom(columnMetadata.transformer, value) : value;

        if (columnMetadata.type === Boolean || columnMetadata.type === "boolean") {
            value = value ? true : false;

        } else if (columnMetadata.type === "datetime" || columnMetadata.type === Date) {
            /**
             * Fix date conversion issue
             *
             * If the format of the date string is "2018-03-14 02:33:33.906", Safari (and iOS WKWebView) will convert it to an invalid date object.
             * We need to modify the date string to "2018-03-14T02:33:33.906Z" and Safari will convert it correctly.
             *
             * ISO 8601
             * https://www.w3.org/TR/NOTE-datetime
             */
            if (value && typeof value === "string") {
                // There are various valid time string formats a sqlite time string might have:
                // https://www.sqlite.org/lang_datefunc.html
                // There are two separate fixes we may need to do:
                //   1) Add 'T' separator if space is used instead
                //   2) Add 'Z' UTC suffix if no timezone or offset specified

                if (/^\d\d\d\d-\d\d-\d\d \d\d:\d\d/.test(value)) {
                    value = value.replace(" ", "T");
                }
                if (/^\d\d\d\d-\d\d-\d\dT\d\d:\d\d(:\d\d(\.\d\d\d)?)?$/.test(value)) {
                    value += "Z";
                }
            }

            value = DateUtils.normalizeHydratedDate(value);

        } else if (columnMetadata.type === "date") {
            value = DateUtils.mixedDateToDateString(value);

        } else if (columnMetadata.type === "time") {
            value = DateUtils.mixedTimeToString(value);

        } else if (columnMetadata.type === "simple-array") {
            value = DateUtils.stringToSimpleArray(value);

        } else if (columnMetadata.type === "simple-json") {
            value = DateUtils.stringToSimpleJson(value);

        } else if ( columnMetadata.type === "simple-enum" ) {
            value = DateUtils.stringToSimpleEnum(value, columnMetadata);

        }
        // Some types are treated differently from the original typeorm.
        else if (
            columnMetadata.type === "int8" ||
            columnMetadata.type === "bigint" ||
            columnMetadata.type === "unsigned big int" ||
            columnMetadata.type === BigInt) {
            // Unlike node-sqlite, deno-sqlite uses BigInt for large numbers.
            // https://github.com/dyedgreen/deno-sqlite/pull/67
            value = BigInt(value);
        }

        if (columnMetadata.transformer)
            value = ApplyValueTransformers.transformFrom(columnMetadata.transformer, value);

        return value;
    }

    /**
     * Replaces parameters in the given sql with special escaping character
     * and an array of parameter names to be passed to a query.
     */
    escapeQueryWithParameters(sql: string, parameters: ObjectLiteral, nativeParameters: ObjectLiteral): [string, any[]] {
        const builtParameters: any[] = Object.keys(nativeParameters).map(key => {
            // Mapping boolean values to their numeric representation
            if (typeof nativeParameters[key] === "boolean") {
                return nativeParameters[key] === true ? 1 : 0;
            }

            return nativeParameters[key];
        });

        if (!parameters || !Object.keys(parameters).length)
            return [sql, builtParameters];

        const keys = Object.keys(parameters).map(parameter => "(:(\\.\\.\\.)?" + parameter + "\\b)").join("|");
        sql = sql.replace(new RegExp(keys, "g"), (key: string): string => {
            let value: any;
            let isArray = false;
            if (key.substr(0, 4) === ":...") {
                isArray = true;
                value = parameters[key.substr(4)];
            } else {
                value = parameters[key.substr(1)];
            }

            if (isArray) {
                return value.map((v: any) => {
                    builtParameters.push(v);
                    return "?";
                    // return "$" + builtParameters.length;
                }).join(", ");

            } else if (value instanceof Function) {
                return value();

            } else {
                builtParameters.push(value);
                return "?";
                // return "$" + builtParameters.length;
            }
        }); // todo: make replace only in value statements, otherwise problems
        return [sql, builtParameters];
    }

    /**
     * Escapes a column name.
     */
    escape(columnName: string): string {
        return "\"" + columnName + "\"";
    }

    /**
     * Build full table name with database name, schema name and table name.
     * E.g. "myDB"."mySchema"."myTable"
     *
     * Returns only simple table name because all inherited drivers does not supports schema and database.
     */
    buildTableName(tableName: string, schema?: string, database?: string): string {
        return tableName;
    }

    /**
     * Creates a database type from a given column metadata.
     */
    normalizeType(column: { type?: ColumnType, length?: number | string, precision?: number|null, scale?: number }): string {
        if (column.type === Number || column.type === "int") {
            return "integer";

        } else if (column.type === String) {
            return "varchar";

        } else if (column.type === Date) {
            return "datetime";

        } else if (column.type === Boolean) {
            return "boolean";

        } else if (column.type === "uuid") {
            return "varchar";

        } else if (column.type === "simple-array") {
            return "text";

        } else if (column.type === "simple-json") {
            return "text";

        } else if (column.type === "simple-enum") {
            return "varchar";

        } else {
            return column.type as string || "";
        }
    }

    /**
     * Normalizes "default" value of the column.
     */
    normalizeDefault(columnMetadata: ColumnMetadata): string {
        const defaultValue = columnMetadata.default;

        if (typeof defaultValue === "number") {
            return "" + defaultValue;

        } else if (typeof defaultValue === "boolean") {
            return defaultValue === true ? "1" : "0";

        } else if (typeof defaultValue === "function") {
            return defaultValue();

        } else if (typeof defaultValue === "string") {
            return `'${defaultValue}'`;

        } else {
            return defaultValue;
        }
    }

    /**
     * Normalizes "isUnique" value of the column.
     */
    normalizeIsUnique(column: ColumnMetadata): boolean {
        return column.entityMetadata.uniques.some(uq => uq.columns.length === 1 && uq.columns[0] === column);
    }

    /**
     * Calculates column length taking into account the default length values.
     */
    getColumnLength(column: ColumnMetadata): string {
        return column.length ? column.length.toString() : "";
    }

    /**
     * Normalizes "default" value of the column.
     */
    createFullType(column: TableColumn): string {
        let type = column.type;

        if (column.length) {
            type += "(" + column.length + ")";

        } else if (column.precision !== null && column.precision !== undefined && column.scale !== null && column.scale !== undefined) {
            type += "(" + column.precision + "," + column.scale + ")";

        } else if (column.precision !== null && column.precision !== undefined) {
            type +=  "(" + column.precision + ")";
        }

        if (column.isArray)
            type += " array";

        return type;
    }

    /**
     * Obtains a new database connection to a master server.
     * Used for replication.
     * If replication is not setup then returns default connection's database connection.
     */
    obtainMasterConnection(): Promise<any> {
        return Promise.resolve();
    }

    /**
     * Obtains a new database connection to a slave server.
     * Used for replication.
     * If replication is not setup then returns master (default) connection's database connection.
     */
    obtainSlaveConnection(): Promise<any> {
        return Promise.resolve();
    }

    /**
     * Creates generated map of values generated or returned by database after INSERT query.
     */
    createGeneratedMap(metadata: EntityMetadata, insertResult: any) {
        const generatedMap = metadata.generatedColumns.reduce((map, generatedColumn) => {
            let value: any;
            if (generatedColumn.generationStrategy === "increment" && insertResult) {
                value = insertResult;
            // } else if (generatedColumn.generationStrategy === "uuid") {
            //     value = insertValue[generatedColumn.databaseName];
            }

            if (!value) return map;
            return OrmUtils.mergeDeep(map, generatedColumn.createValueMap(value));
        }, {} as ObjectLiteral);

        return Object.keys(generatedMap).length > 0 ? generatedMap : undefined;
    }

    /**
     * Differentiate columns of this table and columns from the given column metadatas columns
     * and returns only changed.
     */
    findChangedColumns(tableColumns: TableColumn[], columnMetadatas: ColumnMetadata[]): ColumnMetadata[] {
        return columnMetadatas.filter(columnMetadata => {
            const tableColumn = tableColumns.find(c => c.name === columnMetadata.databaseName);
            if (!tableColumn)
                return false; // we don't need new columns, we only need exist and changed

            // console.log("table:", columnMetadata.entityMetadata.tableName);
            // console.log("name:", tableColumn.name, columnMetadata.databaseName);
            // console.log("type:", tableColumn.type, this.normalizeType(columnMetadata));
            // console.log("length:", tableColumn.length, columnMetadata.length);
            // console.log("precision:", tableColumn.precision, columnMetadata.precision);
            // console.log("scale:", tableColumn.scale, columnMetadata.scale);
            // console.log("comment:", tableColumn.comment, columnMetadata.comment);
            // console.log("default:", tableColumn.default, columnMetadata.default);
            // console.log("isPrimary:", tableColumn.isPrimary, columnMetadata.isPrimary);
            // console.log("isNullable:", tableColumn.isNullable, columnMetadata.isNullable);
            // console.log("isUnique:", tableColumn.isUnique, this.normalizeIsUnique(columnMetadata));
            // console.log("isGenerated:", tableColumn.isGenerated, columnMetadata.isGenerated);
            // console.log("==========================================");

            return tableColumn.name !== columnMetadata.databaseName
                || tableColumn.type !== this.normalizeType(columnMetadata)
                || tableColumn.length !== columnMetadata.length
                || tableColumn.precision !== columnMetadata.precision
                || tableColumn.scale !== columnMetadata.scale
                //  || tableColumn.comment !== columnMetadata.comment || // todo
                || this.normalizeDefault(columnMetadata) !== tableColumn.default
                || tableColumn.isPrimary !== columnMetadata.isPrimary
                || tableColumn.isNullable !== columnMetadata.isNullable
                || tableColumn.isUnique !== this.normalizeIsUnique(columnMetadata)
                || (columnMetadata.generationStrategy !== "uuid" && tableColumn.isGenerated !== columnMetadata.isGenerated);
        });
    }

    /**
     * Returns true if driver supports RETURNING / OUTPUT statement.
     */
    isReturningSqlSupported(): boolean {
        return false;
    }

    /**
     * Returns true if driver supports uuid values generation on its own.
     */
    isUUIDGenerationSupported(): boolean {
        return false;
    }

    /**
     * Creates an escaped parameter.
     */
    createParameter(parameterName: string, index: number): string {
        // return "$" + (index + 1);
        return "?";
        // return "$" + parameterName;
    }

    // -------------------------------------------------------------------------
    // Protected Methods
    // -------------------------------------------------------------------------

    /**
     * Creates connection with the database.
     */
    protected createDatabaseConnection() {
        throw new Error("Do not use AbstractSqlite directly, it has to be used with one of the sqlite drivers");
    }

    /**
     * If driver dependency is not given explicitly, then try to load it via "require".
     */
    protected loadDependencies(): void {
        // dependencies have to be loaded in the specific driver
    }

}
