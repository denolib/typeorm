import {TableColumnOptions} from "../options/TableColumnOptions.ts";

/**
 * Table's columns in the database represented in this class.
 */
export class TableColumn {

    // -------------------------------------------------------------------------
    // Public Properties
    // -------------------------------------------------------------------------

    /**
     * Column name.
     */
    name!: string;

    /**
     * Column type.
     */
    type!: string;

    /**
     * Column's default value.
     */
    default?: any;

    /**
     * ON UPDATE trigger. Works only for MySQL.
     */
    onUpdate?: string;

    /**
     * Indicates if column is NULL, or is NOT NULL in the database.
     */
    isNullable: boolean = false;

    /**
     * Indicates if column is auto-generated sequence.
     */
    isGenerated: boolean = false;

    /**
     * Specifies generation strategy if this column will use auto increment.
     * `rowid` option supported only in CockroachDB.
     */
    generationStrategy?: "uuid"|"increment"|"rowid";

    /**
     * Indicates if column is a primary key.
     */
    isPrimary: boolean = false;

    /**
     * Indicates if column has unique value.
     */
    isUnique: boolean = false;

    /**
     * Indicates if column stores array.
     */
    isArray: boolean = false;

    /**
     * Column's comment.
     */
    comment?: string;

    /**
     * Column type's length. Used only on some column types.
     * For example type = "string" and length = "100" means that ORM will create a column with type varchar(100).
     */
    length: string = "";

    /**
     * Column type's display width. Used only on some column types in MySQL.
     * For example, INT(4) specifies an INT with a display width of four digits.
     */
    width?: number;

    /**
     * Defines column character set.
     */
    charset?: string;

    /**
     * Defines column collation.
     */
    collation?: string;

    /**
     * The precision for a decimal (exact numeric) column (applies only for decimal column), which is the maximum
     * number of digits that are stored for the values.
     */
    precision?: number|null;

    /**
     * The scale for a decimal (exact numeric) column (applies only for decimal column), which represents the number
     * of digits to the right of the decimal point and must not be greater than precision.
     */
    scale?: number;

    /**
     * Puts ZEROFILL attribute on to numeric column. Works only for MySQL.
     * If you specify ZEROFILL for a numeric column, MySQL automatically adds the UNSIGNED attribute to the column
     */
    zerofill: boolean = false;

    /**
     * Puts UNSIGNED attribute on to numeric column. Works only for MySQL.
     */
    unsigned: boolean = false;

    /**
     * Array of possible enumerated values.
     */
    enum?: string[];

    /**
     * Exact name of enum
     */
    enumName?: string;

    /**
     * Generated column expression. Supports only in MySQL.
     */
    asExpression?: string;

    /**
     * Generated column type. Supports only in MySQL.
     */
    generatedType?: "VIRTUAL"|"STORED";

    /**
     * Spatial Feature Type (Geometry, Point, Polygon, etc.)
     */
    spatialFeatureType?: string;

    /**
     * SRID (Spatial Reference ID (EPSG code))
     */
    srid?: number;

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(options?: TableColumnOptions) {
        if (options) {
            this.name = options.name;
            this.type = options.type || "";
            this.length = options.length || "";
            this.width = options.width;
            this.charset = options.charset;
            this.collation = options.collation;
            this.precision = options.precision;
            this.scale = options.scale;
            this.zerofill = options.zerofill || false;
            this.unsigned = this.zerofill ? true : (options.unsigned || false);
            this.default = options.default;
            this.onUpdate = options.onUpdate;
            this.isNullable = options.isNullable || false;
            this.isGenerated = options.isGenerated || false;
            this.generationStrategy = options.generationStrategy;
            this.isPrimary = options.isPrimary || false;
            this.isUnique = options.isUnique || false;
            this.isArray = options.isArray || false;
            this.comment = options.comment;
            this.enum = options.enum;
            this.enumName = options.enumName;
            this.asExpression = options.asExpression;
            this.generatedType = options.generatedType;
            this.spatialFeatureType = options.spatialFeatureType;
            this.srid = options.srid;
        }
    }

    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------

    /**
     * Clones this column to a new column with exact same properties as this column has.
     */
    clone(): TableColumn {
        return new TableColumn(<TableColumnOptions>{
            name: this.name,
            type: this.type,
            length: this.length,
            width: this.width,
            charset: this.charset,
            collation: this.collation,
            precision: this.precision,
            scale: this.scale,
            zerofill: this.zerofill,
            unsigned: this.unsigned,
            enum: this.enum,
            enumName: this.enumName,
            asExpression: this.asExpression,
            generatedType: this.generatedType,
            default: this.default,
            onUpdate: this.onUpdate,
            isNullable: this.isNullable,
            isGenerated: this.isGenerated,
            generationStrategy: this.generationStrategy,
            isPrimary: this.isPrimary,
            isUnique: this.isUnique,
            isArray: this.isArray,
            comment: this.comment,
            spatialFeatureType: this.spatialFeatureType,
            srid: this.srid
        });
    }

}
