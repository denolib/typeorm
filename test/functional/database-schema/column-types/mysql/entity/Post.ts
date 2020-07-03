import {Entity} from "../../../../../../src/decorator/entity/Entity.ts";
import {PrimaryColumn} from "../../../../../../src/decorator/columns/PrimaryColumn.ts";
import {Column} from "../../../../../../src/decorator/columns/Column.ts";
import {FruitEnum} from "../enum/FruitEnum.ts";

@Entity()
export class Post {

    // -------------------------------------------------------------------------
    // Numeric Types
    // -------------------------------------------------------------------------

    @PrimaryColumn({ type: Number })
    id!: number;

    @Column("bit")
    bit!: Uint8Array;

    @Column("int")
    int!: number;

    @Column("integer")
    integer!: number;

    @Column("tinyint")
    tinyint!: number;

    @Column("smallint")
    smallint!: number;

    @Column("mediumint")
    mediumint!: number;

    @Column("bigint")
    bigint!: string;

    @Column("float")
    float!: number;

    @Column("double")
    double!: number;

    @Column("double precision")
    doublePrecision!: number;

    @Column("real")
    real!: number;

    @Column("dec")
    dec!: string;

    @Column("decimal")
    decimal!: string;

    @Column("numeric")
    numeric!: string;

    @Column("fixed")
    fixed!: string;

    // -------------------------------------------------------------------------
    // Boolean Type
    // -------------------------------------------------------------------------

    @Column("boolean")
    boolean!: boolean;

    @Column("bool")
    bool!: boolean;

    // -------------------------------------------------------------------------
    // String Types
    // -------------------------------------------------------------------------

    @Column("char")
    char!: string;

    @Column("nchar")
    nChar!: string;

    @Column("national char")
    nationalChar!: string;

    @Column("varchar")
    varchar!: string;

    @Column("nvarchar")
    nVarchar!: string;

    @Column("national varchar")
    nationalVarchar!: string;

    @Column("text")
    text!: string;

    @Column("tinytext")
    tinytext!: string;

    @Column("mediumtext")
    mediumtext!: string;

    @Column("longtext")
    longtext!: string;

    // -------------------------------------------------------------------------
    // Binary Types
    // -------------------------------------------------------------------------
    @Column("binary")
    binary!: Uint8Array; /* Buffer; */

    @Column("varbinary")
    varbinary!: Uint8Array; /* Buffer; */

    // -------------------------------------------------------------------------
    // LOB Types
    // -------------------------------------------------------------------------

    @Column("blob")
    blob!: Uint8Array; /* Buffer; */

    @Column("tinyblob")
    tinyblob!: Uint8Array; /* Buffer; */

    @Column("mediumblob")
    mediumblob!: Uint8Array; /* Buffer; */

    @Column("longblob")
    longblob!: Uint8Array; /* Buffer; */

    // -------------------------------------------------------------------------
    // Date Types
    // -------------------------------------------------------------------------

    @Column("date")
    date!: string;

    @Column("datetime")
    datetime!: Date;

    @Column("timestamp")
    timestamp!: Date;

    @Column("time")
    time!: string;

    @Column("year")
    year!: number;

    // -------------------------------------------------------------------------
    // Spatial Types
    // -------------------------------------------------------------------------

    @Column("geometry")
    geometry!: string;

    @Column("point")
    point!: string;

    @Column("linestring")
    linestring!: string;

    @Column("polygon")
    polygon!: string;

    @Column("multipoint")
    multipoint!: string;

    @Column("multilinestring")
    multilinestring!: string;

    @Column("multipolygon")
    multipolygon!: string;

    @Column("geometrycollection")
    geometrycollection!: string;

    // -------------------------------------------------------------------------
    // Other Types
    // -------------------------------------------------------------------------

    @Column("enum", { enum: ["A", "B", "C"] })
    enum!: string;

    @Column("enum", { enum: FruitEnum })
    classEnum1!: FruitEnum;

    @Column("json")
    json!: Object;

    @Column("simple-array")
    simpleArray!: string[];

    @Column("simple-json")
    simpleJson!: { param: string };

    @Column("simple-enum", { enum: ["A", "B", "C"] })
    simpleEnum!: string;

    @Column("simple-enum", { enum: FruitEnum })
    simpleClassEnum1!: FruitEnum;
}
