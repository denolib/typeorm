import {Driver} from "../Driver.ts";
import {ConnectionIsNotSetError} from "../../error/ConnectionIsNotSetError.ts";
import {DriverUtils} from "../DriverUtils.ts";
import {MysqlQueryRunner} from "./MysqlQueryRunner.ts";
import {ObjectLiteral} from "../../common/ObjectLiteral.ts";
import {ColumnMetadata} from "../../metadata/ColumnMetadata.ts";
import {DateUtils} from "../../util/DateUtils.ts";
import {Connection} from "../../connection/Connection.ts";
import {RdbmsSchemaBuilder} from "../../schema-builder/RdbmsSchemaBuilder.ts";
import {MysqlConnectionOptions} from "./MysqlConnectionOptions.ts";
import {MappedColumnTypes} from "../types/MappedColumnTypes.ts";
import {ColumnType} from "../types/ColumnTypes.ts";
import {DataTypeDefaults} from "../types/DataTypeDefaults.ts";
import {TableColumn} from "../../schema-builder/table/TableColumn.ts";
import {MysqlConnectionCredentialsOptions} from "./MysqlConnectionCredentialsOptions.ts";
import {EntityMetadata} from "../../metadata/EntityMetadata.ts";
import {OrmUtils} from "../../util/OrmUtils.ts";
import {ApplyValueTransformers} from "../../util/ApplyValueTransformers.ts";
import {NotImplementedError} from "../../error/NotImplementedError.ts";
import type * as DenoMysql from "../../../vendor/https/deno.land/x/mysql/mod.ts";
import type {ReleaseConnection, RawExecuteResult} from "./typings.ts";
import {deferred} from "../../../vendor/https/deno.land/std/async/deferred.ts";
import {decode, encode} from "../../../vendor/https/deno.land/std/encoding/utf8.ts";

/**
 * Organizes communication with MySQL DBMS.
 */
export class MysqlDriver implements Driver {

    // -------------------------------------------------------------------------
    // Public Properties
    // -------------------------------------------------------------------------

    /**
     * Connection used by driver.
     */
    connection: Connection;

    /**
     * Mysql underlying library.
     */
    private mysql!: typeof DenoMysql;

    /**
     * Connection pool.
     * Used in non-replication mode.
     */
    pool?: DenoMysql.Client;

    /**
     * Pool cluster used in replication mode.
     */
    poolCluster: any;

    // -------------------------------------------------------------------------
    // Public Implemented Properties
    // -------------------------------------------------------------------------

    /**
     * Connection options.
     */
    options: MysqlConnectionOptions;

    /**
     * Master database used to perform all write queries.
     */
    database?: string;

    /**
     * Indicates if replication is enabled.
     */
    isReplicated: boolean = false;

    /**
     * Indicates if tree tables are supported by this driver.
     */
    treeSupport = true;

    /**
     * Gets list of supported column data types by a driver.
     *
     * @see https://www.tutorialspoint.com/mysql/mysql-data-types.htm
     * @see https://dev.mysql.com/doc/refman/8.0/en/data-types.html
     */
    supportedDataTypes: ColumnType[] = [
        // numeric types
        "bit",
        "int",
        "integer",          // synonym for int
        "tinyint",
        "smallint",
        "mediumint",
        "bigint",
        "float",
        "double",
        "double precision", // synonym for double
        "real",             // synonym for double
        "decimal",
        "dec",              // synonym for decimal
        "numeric",          // synonym for decimal
        "fixed",            // synonym for decimal
        "bool",             // synonym for tinyint
        "boolean",          // synonym for tinyint
        // date and time types
        "date",
        "datetime",
        "timestamp",
        "time",
        "year",
        // string types
        "char",
        "nchar",            // synonym for national char
        "national char",
        "varchar",
        "nvarchar",         // synonym for national varchar
        "national varchar",
        "blob",
        "text",
        "tinyblob",
        "tinytext",
        "mediumblob",
        "mediumtext",
        "longblob",
        "longtext",
        "enum",
        "set",
        "binary",
        "varbinary",
        // json data type
        "json",
        // spatial data types
        "geometry",
        "point",
        "linestring",
        "polygon",
        "multipoint",
        "multilinestring",
        "multipolygon",
        "geometrycollection"
    ];

    /**
     * Gets list of spatial column data types.
     */
    spatialTypes: ColumnType[] = [
        "geometry",
        "point",
        "linestring",
        "polygon",
        "multipoint",
        "multilinestring",
        "multipolygon",
        "geometrycollection"
    ];

    /**
     * Gets list of column data types that support length by a driver.
     */
    withLengthColumnTypes: ColumnType[] = [
        "char",
        "varchar",
        "nvarchar",
        "binary",
        "varbinary"
    ];

    /**
     * Gets list of column data types that support length by a driver.
     */
    withWidthColumnTypes: ColumnType[] = [
        "bit",
        "tinyint",
        "smallint",
        "mediumint",
        "int",
        "integer",
        "bigint"
    ];

    /**
     * Gets list of column data types that support precision by a driver.
     */
    withPrecisionColumnTypes: ColumnType[] = [
        "decimal",
        "dec",
        "numeric",
        "fixed",
        "float",
        "double",
        "double precision",
        "real",
        "time",
        "datetime",
        "timestamp"
    ];

    /**
     * Gets list of column data types that supports scale by a driver.
     */
    withScaleColumnTypes: ColumnType[] = [
        "decimal",
        "dec",
        "numeric",
        "fixed",
        "float",
        "double",
        "double precision",
        "real"
    ];

    /**
     * Gets list of column data types that supports UNSIGNED and ZEROFILL attributes.
     */
    unsignedAndZerofillTypes: ColumnType[] = [
        "int",
        "integer",
        "smallint",
        "tinyint",
        "mediumint",
        "bigint",
        "decimal",
        "dec",
        "numeric",
        "fixed",
        "float",
        "double",
        "double precision",
        "real"
    ];

    /**
     * ORM has special columns and we need to know what database column types should be for those columns.
     * Column types are driver dependant.
     */
    mappedDataTypes: MappedColumnTypes = {
        createDate: "datetime",
        createDatePrecision: 6,
        createDateDefault: "CURRENT_TIMESTAMP(6)",
        updateDate: "datetime",
        updateDatePrecision: 6,
        updateDateDefault: "CURRENT_TIMESTAMP(6)",
        version: "int",
        treeLevel: "int",
        migrationId: "int",
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
    dataTypeDefaults: DataTypeDefaults = {
        "varchar": { length: 255 },
        "nvarchar": { length: 255 },
        "national varchar": { length: 255 },
        "char": { length: 1 },
        "binary": { length: 1 },
        "varbinary": { length: 255 },
        "decimal": { precision: 10, scale: 0 },
        "dec": { precision: 10, scale: 0 },
        "numeric": { precision: 10, scale: 0 },
        "fixed": { precision: 10, scale: 0 },
        "float": { precision: 12 },
        "double": { precision: 22 },
        "time": { precision: 0 },
        "datetime": { precision: 0 },
        "timestamp": { precision: 0 },
        "bit": { width: 1 },
        "int": { width: 11 },
        "integer": { width: 11 },
        "tinyint": { width: 4 },
        "smallint": { width: 6 },
        "mediumint": { width: 9 },
        "bigint": { width: 20 }
    };


    /**
     * Max length allowed by MySQL for aliases.
     * @see https://dev.mysql.com/doc/refman/5.5/en/identifiers.html
     */
    maxAliasLength = 63;

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(connection: Connection) {
        this.connection = connection;
        this.options = {
            legacySpatialSupport: true,
            ...connection.options
        } as MysqlConnectionOptions;
        this.isReplicated = this.options.replication ? true : false;

        this.database = this.options.replication ? this.options.replication.master.database : this.options.database;

        // validate options to make sure everything is set
        // todo: revisit validation with replication in mind
        // if (!(this.options.host || (this.options.extra && this.options.extra.socketPath)) && !this.options.socketPath)
        //     throw new DriverOptionNotSetError("socketPath and host");
        // if (!this.options.username)
        //     throw new DriverOptionNotSetError("username");
        // if (!this.options.database)
        //     throw new DriverOptionNotSetError("database");
        // todo: check what is going on when connection is setup without database and how to connect to a database then?
        // todo: provide options to auto-create a database if it does not exist yet
    }

    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------

    /**
     * Performs connection to the database.
     */
    async connect(): Promise<void> {
        await this.loadDependencies();

        if (this.options.replication) {
            /*
            this.poolCluster = this.mysql.createPoolCluster(this.options.replication);
            this.options.replication.slaves.forEach((slave, index) => {
                this.poolCluster.add("SLAVE" + index, this.createConnectionOptions(this.options, slave));
            });
            this.poolCluster.add("MASTER", this.createConnectionOptions(this.options, this.options.replication.master));
            */
           throw new NotImplementedError("MysqlConnectionOptions.replication is not currently supported yet");

        } else {
            this.pool = await this.createPool(this.createConnectionOptions(this.options, this.options));
        }
    }

    /**
     * Makes any action after connection (e.g. create extensions in Postgres driver).
     */
    afterConnect(): Promise<void> {
        return Promise.resolve();
    }

    /**
     * Closes connection with the database.
     */
    async disconnect(): Promise<void> {
        if (!this.poolCluster && !this.pool)
            return Promise.reject(new ConnectionIsNotSetError("mysql"));

        if (this.poolCluster) {
            return new Promise<void>((ok, fail) => {
                this.poolCluster.end((err: any) => err ? fail(err) : ok());
                this.poolCluster = undefined;
            });
        }
        if (this.pool) {
            await this.pool.close();
            this.pool = undefined;
        }
    }

    /**
     * Creates a schema builder used to build and sync a schema.
     */
    createSchemaBuilder() {
        return new RdbmsSchemaBuilder(this.connection);
    }

    /**
     * Creates a query runner used to execute database queries.
     */
    createQueryRunner(mode: "master"|"slave" = "master") {
        return new MysqlQueryRunner(this, mode);
    }

    /**
     * Replaces parameters in the given sql with special escaping character
     * and an array of parameter names to be passed to a query.
     */
    escapeQueryWithParameters(sql: string, parameters: ObjectLiteral, nativeParameters: ObjectLiteral): [string, any[]] {
        const escapedParameters: any[] = Object.keys(nativeParameters).map(key => nativeParameters[key]);
        if (!parameters || !Object.keys(parameters).length)
            return [sql, escapedParameters];

        // Replace `(:...<name>)` with `:...<name>`
        // See: https://github.com/manyuanrong/deno_mysql/issues/36
        // TODO find more efficient way to do this.
        sql = sql.replace(/\((:\.\.\.[^)]+\b)\)/g, "$1");

        const keys = Object.keys(parameters).map(parameter => "(:(\\.\\.\\.)?" + parameter + "\\b)").join("|");
        sql = sql.replace(new RegExp(keys, "g"), (key: string) => {
            let value: any;
            if (key.substr(0, 4) === ":...") {
                value = parameters[key.substr(4)];
            } else {
                value = parameters[key.substr(1)];
            }

            if (value instanceof Function) {
                return value();

            } else {
                escapedParameters.push(value);
                return "?";
            }
        }); // todo: make replace only in value statements, otherwise problems

        return [sql, escapedParameters];
    }

    /**
     * Escapes a column name.
     */
    escape(columnName: string): string {
        return "`" + columnName + "`";
    }

    /**
     * Build full table name with database name, schema name and table name.
     * E.g. "myDB"."mySchema"."myTable"
     */
    buildTableName(tableName: string, schema?: string, database?: string): string {
        return database ? `${database}.${tableName}` : tableName;
    }

    /**
     * Prepares given value to a value to be persisted, based on its column type and metadata.
     */
    preparePersistentValue(value: any, columnMetadata: ColumnMetadata): any {
        if (columnMetadata.transformer)
            value = ApplyValueTransformers.transformTo(columnMetadata.transformer, value);

        if (value === null || value === undefined)
            return value;

        if (columnMetadata.type === Boolean) {
            return value === true ? 1 : 0;

        } else if (columnMetadata.type === "date") {
            return DateUtils.mixedDateToDateString(value);

        } else if (columnMetadata.type === "time") {
            return DateUtils.mixedDateToTimeString(value);

        } else if (columnMetadata.type === "json") {
            return JSON.stringify(value);

        } else if (columnMetadata.type === "timestamp" || columnMetadata.type === "datetime" || columnMetadata.type === Date) {
            return DateUtils.mixedDateToDate(value);

        } else if (columnMetadata.type === "simple-array") {
            return DateUtils.simpleArrayToString(value);

        } else if (columnMetadata.type === "simple-json") {
            return DateUtils.simpleJsonToString(value);

        } else if (columnMetadata.type === "enum" || columnMetadata.type === "simple-enum") {
            return "" + value;

        } else if (columnMetadata.type === "set") {
            return DateUtils.simpleArrayToString(value);
        } else if (value instanceof Uint8Array) {
            // TODO We want to avoid this decoding...
            return decode(value);
        }

        return value;
    }

    /**
     * Prepares given value to a value to be persisted, based on its column type or metadata.
     */
    prepareHydratedValue(value: any, columnMetadata: ColumnMetadata): any {
        if (value === null || value === undefined)
            return columnMetadata.transformer ? ApplyValueTransformers.transformFrom(columnMetadata.transformer, value) : value;

        if (columnMetadata.type === Boolean || columnMetadata.type === "bool" || columnMetadata.type === "boolean") {
            value = value ? true : false;

        } else if (columnMetadata.type === "datetime" || columnMetadata.type === Date) {
            value = DateUtils.normalizeHydratedDate(value);

        } else if (columnMetadata.type === "date") {
            value = DateUtils.mixedDateToDateString(value);

        } else if (columnMetadata.type === "json") {
            value = typeof value === "string" ? JSON.parse(value) : value;

        } else if (columnMetadata.type === "time") {
            value = DateUtils.mixedTimeToString(value);

        } else if (columnMetadata.type === "simple-array") {
            value = DateUtils.stringToSimpleArray(value);

        } else if (columnMetadata.type === "simple-json") {
            value = DateUtils.stringToSimpleJson(value);

        } else if ((columnMetadata.type === "enum" || columnMetadata.type === "simple-enum")
            && columnMetadata.enum
            && !isNaN(value)
            && columnMetadata.enum.indexOf(parseInt(value)) >= 0) {
            // convert to number if that exists in possible enum options
            value = parseInt(value);
        } else if (columnMetadata.type === "set") {
            value = DateUtils.stringToSimpleArray(value);
        } else if (columnMetadata.type === "bigint" || columnMetadata.type === "decimal") {
            value = String(value);
        } // Some types are treated differently from the original typeorm.
        else if (
            columnMetadata.type === "tinyblob" ||
            columnMetadata.type === "mediumblob" ||
            columnMetadata.type === "longblob" ||
            columnMetadata.type === "blob" ||
            columnMetadata.type === "binary" ||
            columnMetadata.type === "varbinary" ||
            columnMetadata.type === "bit" ||
            columnMetadata.type === Uint8Array) {
            // treats binary data as `Uint8Array`
            // See https://github.com/mysqljs/mysql#buffer
            value = encode(value);
        } // For compatibility with the original typeorm, we convert specific types.
        else if (columnMetadata.type === "year") {
            value = Number(value);
        }

        if (columnMetadata.transformer)
            value = ApplyValueTransformers.transformFrom(columnMetadata.transformer, value);

        return value;
    }

    /**
     * Creates a database type from a given column metadata.
     */
    normalizeType(column: { type: ColumnType, length?: number|string, precision?: number|null, scale?: number }): string {
        if (column.type === Number || column.type === "integer") {
            return "int";

        } else if (column.type === String) {
            return "varchar";

        } else if (column.type === Date) {
            return "datetime";

        } else if (column.type === Uint8Array) {
            return "blob";

        } else if (column.type === Boolean) {
            return "tinyint";

        } else if (column.type === "uuid") {
            return "varchar";

        } else if (column.type === "simple-array" || column.type === "simple-json") {
            return "text";

        } else if (column.type === "simple-enum") {
            return "enum";

        } else if (column.type === "double precision" || column.type === "real") {
            return "double";

        } else if (column.type === "dec" || column.type === "numeric" || column.type === "fixed") {
            return "decimal";

        } else if (column.type === "bool" || column.type === "boolean") {
            return "tinyint";

        } else if (column.type === "nvarchar" || column.type === "national varchar") {
            return "varchar";

        } else if (column.type === "nchar" || column.type === "national char") {
            return "char";

        } else {
            return column.type as string || "";
        }
    }

    /**
     * Normalizes "default" value of the column.
     */
    normalizeDefault(columnMetadata: ColumnMetadata): string {
        const defaultValue = columnMetadata.default;

        if ((columnMetadata.type === "enum" || columnMetadata.type === "simple-enum") && defaultValue !== undefined) {
            return `'${defaultValue}'`;
        }

        if ((columnMetadata.type === "set") && defaultValue !== undefined) {
            return `'${DateUtils.simpleArrayToString(defaultValue)}'`;
        }

        if (typeof defaultValue === "number") {
            return "" + defaultValue;

        } else if (typeof defaultValue === "boolean") {
            return defaultValue === true ? "1" : "0";

        } else if (typeof defaultValue === "function") {
            return defaultValue();

        } else if (typeof defaultValue === "string") {
            return `'${defaultValue}'`;

        } else if (defaultValue === null) {
            return `null`;

        } else {
            return defaultValue;
        }
    }

    /**
     * Normalizes "isUnique" value of the column.
     */
    normalizeIsUnique(column: ColumnMetadata): boolean {
        return column.entityMetadata.indices.some(idx => idx.isUnique && idx.columns.length === 1 && idx.columns[0] === column);
    }

    /**
     * Returns default column lengths, which is required on column creation.
     */
    getColumnLength(column: ColumnMetadata|TableColumn): string {
        if (column.length)
            return column.length.toString();

        /**
         * fix https://github.com/typeorm/typeorm/issues/1139
         */
        if (column.generationStrategy === "uuid")
            return "36";

        switch (column.type) {
            case String:
            case "varchar":
            case "nvarchar":
            case "national varchar":
                return "255";
            case "varbinary":
                return "255";
            default:
                return "";
        }
    }

    /**
     * Creates column type definition including length, precision and scale
     */
    createFullType(column: TableColumn): string {
        let type = column.type;

        // used 'getColumnLength()' method, because MySQL requires column length for `varchar`, `nvarchar` and `varbinary` data types
        if (this.getColumnLength(column)) {
            type += `(${this.getColumnLength(column)})`;

        } else if (column.width) {
            type += `(${column.width})`;

        } else if (column.precision !== null && column.precision !== undefined && column.scale !== null && column.scale !== undefined) {
            type += `(${column.precision},${column.scale})`;

        } else if (column.precision !== null && column.precision !== undefined) {
            type += `(${column.precision})`;
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
    async obtainMasterConnection(): Promise<[DenoMysql.Connection, ReleaseConnection]> {
        if (this.poolCluster) {
            throw new NotImplementedError("MysqlDriver.poolCluster is not currently supported yet");
            /*
            this.poolCluster.getConnection("MASTER", (err: any, dbConnection: any) => {
                err ? fail(err) : ok(this.prepareDbConnection(dbConnection));
            });
            */

        } else if (this.pool) {
            const connectionPromise = deferred<[DenoMysql.Connection, ReleaseConnection]>();
            const releasePromise = new Promise<void>(resolve => {
                this.pool!.useConnection((connection: DenoMysql.Connection) => {
                    const release = async () => resolve();
                    connectionPromise.resolve([connection, release]);
                    return releasePromise;
                });
            });
            return connectionPromise;
        } else {
            throw new Error(`Connection is not established with mysql database`);
        }
    }

    /**
     * Obtains a new database connection to a slave server.
     * Used for replication.
     * If replication is not setup then returns master (default) connection's database connection.
     */
    obtainSlaveConnection(): Promise<[DenoMysql.Connection, ReleaseConnection]> {
        if (!this.poolCluster)
            return this.obtainMasterConnection();

        return new Promise<any>((ok, fail) => {
            this.poolCluster.getConnection("SLAVE*", (err: any, dbConnection: any) => {
                err ? fail(err) : ok(dbConnection);
            });
        });
    }

    /**
     * Creates generated map of values generated or returned by database after INSERT query.
     */
    createGeneratedMap(metadata: EntityMetadata, insertResult: RawExecuteResult) {
        const generatedMap = metadata.generatedColumns.reduce((map, generatedColumn) => {
            let value: any;
            if (generatedColumn.generationStrategy === "increment" && insertResult.lastInsertId) {
                value = insertResult.lastInsertId;
            // } else if (generatedColumn.generationStrategy === "uuid") {
            //     console.log("getting db value:", generatedColumn.databaseName);
            //     value = generatedColumn.getEntityValue(uuidMap);
            }

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
            // console.log("width:", tableColumn.width, columnMetadata.width);
            // console.log("precision:", tableColumn.precision, columnMetadata.precision);
            // console.log("scale:", tableColumn.scale, columnMetadata.scale);
            // console.log("zerofill:", tableColumn.zerofill, columnMetadata.zerofill);
            // console.log("unsigned:", tableColumn.unsigned, columnMetadata.unsigned);
            // console.log("asExpression:", tableColumn.asExpression, columnMetadata.asExpression);
            // console.log("generatedType:", tableColumn.generatedType, columnMetadata.generatedType);
            // console.log("comment:", tableColumn.comment, columnMetadata.comment);
            // console.log("default:", tableColumn.default, columnMetadata.default);
            // console.log("enum:", tableColumn.enum, columnMetadata.enum);
            // console.log("default changed:", !this.compareDefaultValues(this.normalizeDefault(columnMetadata), tableColumn.default));
            // console.log("onUpdate:", tableColumn.onUpdate, columnMetadata.onUpdate);
            // console.log("isPrimary:", tableColumn.isPrimary, columnMetadata.isPrimary);
            // console.log("isNullable:", tableColumn.isNullable, columnMetadata.isNullable);
            // console.log("isUnique:", tableColumn.isUnique, this.normalizeIsUnique(columnMetadata));
            // console.log("isGenerated:", tableColumn.isGenerated, columnMetadata.isGenerated);
            // console.log((columnMetadata.generationStrategy !== "uuid" && tableColumn.isGenerated !== columnMetadata.isGenerated));
            // console.log("==========================================");

            let columnMetadataLength = columnMetadata.length;
            if (!columnMetadataLength && columnMetadata.generationStrategy === "uuid") { // fixing #3374
                columnMetadataLength = this.getColumnLength(columnMetadata);
            }

            return tableColumn.name !== columnMetadata.databaseName
                || tableColumn.type !== this.normalizeType(columnMetadata)
                || tableColumn.length !== columnMetadataLength
                || tableColumn.width !== columnMetadata.width
                || tableColumn.precision !== columnMetadata.precision
                || tableColumn.scale !== columnMetadata.scale
                || tableColumn.zerofill !== columnMetadata.zerofill
                || tableColumn.unsigned !== columnMetadata.unsigned
                || tableColumn.asExpression !== columnMetadata.asExpression
                || tableColumn.generatedType !== columnMetadata.generatedType
                // || tableColumn.comment !== columnMetadata.comment // todo
                || !this.compareDefaultValues(this.normalizeDefault(columnMetadata), tableColumn.default)
                || (tableColumn.enum && columnMetadata.enum && !OrmUtils.isArraysEqual(tableColumn.enum, columnMetadata.enum.map(val => val + "")))
                || tableColumn.onUpdate !== columnMetadata.onUpdate
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
        return "?";
    }

    // -------------------------------------------------------------------------
    // Protected Methods
    // -------------------------------------------------------------------------

    /**
     * Loads all driver dependencies.
     */
    protected async loadDependencies(): Promise<void> {
        this.mysql = await import("../../../vendor/https/deno.land/x/mysql/mod.ts");
    }

    /**
     * Creates a new connection pool for a given database credentials.
     */
    protected createConnectionOptions(options: MysqlConnectionOptions, credentials: MysqlConnectionCredentialsOptions): DenoMysql.ClientConfig {

        credentials = Object.assign({}, credentials, DriverUtils.buildDriverOptions(credentials)); // todo: do it better way

        // build connection options for the driver
        return {
            charset: options.charset,
            timezone: options.timezone,
            insecureAuth: options.insecureAuth,
            supportBigNumbers: options.supportBigNumbers !== undefined ? options.supportBigNumbers : true,
            bigNumberStrings: options.bigNumberStrings !== undefined ? options.bigNumberStrings : true,
            dateStrings: options.dateStrings,
            debug: options.debug,
            trace: options.trace,
            multipleStatements: options.multipleStatements,
            flags: options.flags,

            // connection options
            hostname: credentials.host || "localhost",
            username: credentials.username,
            password: credentials.password,
            db: credentials.database,
            port: credentials.port,
            ssl: options.ssl,
            timeout: options.connectTimeout || 1000,

            // timeout options
            ...(options.acquireTimeout === undefined
              ? {}
              : { acquireTimeout: options.acquireTimeout }),

            // extra options
            ...{
                poolSize: 10, // This matches the default value of the Node.js's mysql module.
                ...(options.extra || {})
            }
        } as DenoMysql.ClientConfig;
    }

    /**
     * Creates a new connection pool for a given database credentials.
     */
    protected createPool(connectionOptions: DenoMysql.ClientConfig): Promise<DenoMysql.Client> {

        // create a connection pool
        const pool = new this.mysql.Client();
        return pool.connect(connectionOptions);
    }

    /**
     * Attaches all required base handlers to a database connection, such as the unhandled error handler.
     */
    private prepareDbConnection(connection: any): any {
        const { logger } = this.connection;
        /*
          Attaching an error handler to connection errors is essential, as, otherwise, errors raised will go unhandled and
          cause the hosting app to crash.
         */
        if (connection.listeners("error").length === 0) {
            connection.on("error", (error: any) => logger.log("warn", `MySQL connection raised an error. ${error}`));
        }
        return connection;
    }

    /**
     * Checks if "DEFAULT" values in the column metadata and in the database are equal.
     */
    protected compareDefaultValues(columnMetadataValue: string, databaseValue: string): boolean {
        if (typeof columnMetadataValue === "string" && typeof databaseValue === "string") {
            // we need to cut out "'" because in mysql we can understand returned value is a string or a function
            // as result compare cannot understand if default is really changed or not
            columnMetadataValue = columnMetadataValue.replace(/^'+|'+$/g, "");
            databaseValue = databaseValue.replace(/^'+|'+$/g, "");
        }

        return columnMetadataValue === databaseValue;
    }

}
