import {Entity} from "../../../../../../src/decorator/entity/Entity.ts";
import {PrimaryColumn} from "../../../../../../src/decorator/columns/PrimaryColumn.ts";
import {Column} from "../../../../../../src/decorator/columns/Column.ts";
import {FruitEnum} from "../enum/FruitEnum.ts";

@Entity()
export class Post {

    @PrimaryColumn({ type: Number })
    id!: number;

    @Column({ type: String })
    name!: string;

    // -------------------------------------------------------------------------
    // Numeric Types
    // -------------------------------------------------------------------------

    @Column("bit")
    bit!: boolean;

    @Column("tinyint")
    tinyint!: number;

    @Column("smallint")
    smallint!: number;

    @Column("int")
    int!: number;

    @Column("bigint")
    bigint!: string;

    @Column("decimal")
    decimal!: number;

    @Column("dec")
    dec!: number;

    @Column("numeric")
    numeric!: number;

    @Column("float")
    float!: number;

    @Column("real")
    real!: number;

    @Column("smallmoney")
    smallmoney!: number;

    @Column("money")
    money!: number;

    // -------------------------------------------------------------------------
    // Character Types
    // -------------------------------------------------------------------------

    @Column("uniqueidentifier")
    uniqueidentifier!: string;

    @Column("char")
    char!: string;

    @Column("varchar")
    varchar!: string;

    @Column("text")
    text!: string;

    @Column("nchar")
    nchar!: string;

    @Column("nvarchar")
    nvarchar!: string;

    @Column("ntext")
    ntext!: string;

    @Column("binary")
    binary!: Uint8Array;/* Buffer; */

    @Column("varbinary")
    varbinary!: Uint8Array; /* Buffer; */

    @Column("image")
    image!: Uint8Array; /* Buffer; */

    @Column("rowversion")
    rowversion!: Uint8Array; /* Buffer; */

    // -------------------------------------------------------------------------
    // Date Types
    // -------------------------------------------------------------------------

    @Column("date")
    dateObj!: Date;

    @Column("date")
    date!: string;

    @Column("datetime")
    datetime!: Date;

    @Column("datetime2")
    datetime2!: Date;

    @Column("smalldatetime")
    smalldatetime!: Date;

    @Column("time")
    timeObj!: Date;

    @Column("time")
    time!: string;

    @Column("datetimeoffset")
    datetimeoffset!: Date;

    // -------------------------------------------------------------------------
    // Spatial Types
    // -------------------------------------------------------------------------

    @Column("geometry")
    geometry1!: string;

    @Column("geometry")
    geometry2!: string;

    @Column("geometry")
    geometry3!: string;

    // -------------------------------------------------------------------------
    // TypeOrm Specific Types
    // -------------------------------------------------------------------------

    @Column("simple-array")
    simpleArray!: string[];

    @Column("simple-json")
    simpleJson!: { param: string };

    @Column("simple-enum", { enum: ["A", "B", "C"] })
    simpleEnum!: string;

    @Column("simple-enum", { enum: FruitEnum })
    simpleClassEnum1!: FruitEnum;
}
