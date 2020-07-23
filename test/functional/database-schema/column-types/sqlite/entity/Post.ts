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
    // Integer Types
    // -------------------------------------------------------------------------

    @Column("integer")
    integer!: number;

    @Column("int")
    int!: number;

    @Column("int2")
    int2!: number;

    @Column("int8")
    int8!: BigInt;

    @Column("tinyint")
    tinyint!: number;

    @Column("smallint")
    smallint!: number;

    @Column("mediumint")
    mediumint!: number;

    @Column("bigint")
    bigint!: BigInt;

    @Column("unsigned big int")
    unsignedBigInt!: BigInt;

    // -------------------------------------------------------------------------
    // Character Types
    // -------------------------------------------------------------------------

    @Column("character")
    character!: string;

    @Column("varchar")
    varchar!: string;

    @Column("varying character")
    varyingCharacter!: string;

    @Column("nchar")
    nchar!: string;

    @Column("native character")
    nativeCharacter!: string;

    @Column("nvarchar")
    nvarchar!: string;

    @Column("text")
    text!: string;

    @Column("blob")
    blob!: Uint8Array; /* Buffer; */

    @Column("clob")
    clob!: string;

    // -------------------------------------------------------------------------
    // Real Types
    // -------------------------------------------------------------------------

    @Column("real")
    real!: number;

    @Column("double")
    double!: number;

    @Column("double precision")
    doublePrecision!: number;

    @Column("float")
    float!: number;

    // -------------------------------------------------------------------------
    // Numeric Types
    // -------------------------------------------------------------------------

    @Column("numeric")
    numeric!: number;

    @Column("decimal")
    decimal!: number;

    @Column("boolean")
    boolean!: boolean;

    @Column("date")
    date!: string;

    @Column("datetime")
    datetime!: Date;

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
