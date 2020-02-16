import {Entity} from "../../../../../../src/decorator/entity/Entity.ts";
import {PrimaryColumn} from "../../../../../../src/decorator/columns/PrimaryColumn.ts";
import {Column} from "../../../../../../src/decorator/columns/Column.ts";

@Entity()
export class Post {

    @PrimaryColumn({ type: Number })
    id: number;

    @Column({ type: String })
    name: string;

    // -------------------------------------------------------------------------
    // Numeric Types
    // -------------------------------------------------------------------------

    @Column("number")
    number: number;

    @Column("numeric")
    numeric: number;

    @Column("float")
    float: number;

    @Column("dec")
    dec: number;

    @Column("decimal")
    decimal: number;

    @Column("int")
    int: number;

    @Column("integer")
    integer: number;

    @Column("smallint")
    smallint: number;

    @Column("real")
    real: number;

    @Column("double precision")
    doublePrecision: number;

    // -------------------------------------------------------------------------
    // Character Types
    // -------------------------------------------------------------------------

    @Column("char")
    char: string;

    @Column("nchar")
    nchar: string;

    @Column("nvarchar2")
    nvarchar2: string;

    @Column("varchar2")
    varchar2: string;

    @Column("long")
    long: string;

    @Column("raw")
    raw: Uint8Array; /* Buffer; */

    // -------------------------------------------------------------------------
    // Date Types
    // -------------------------------------------------------------------------

    @Column("date")
    dateObj: Date;

    @Column("date")
    date: string;

    @Column("timestamp")
    timestamp: Date;

    @Column("timestamp with time zone")
    timestampWithTimeZone: Date;

    @Column("timestamp with local time zone")
    timestampWithLocalTimeZone: Date;

    // -------------------------------------------------------------------------
    // LOB Type
    // -------------------------------------------------------------------------

    @Column("blob")
    blob: Uint8Array; /* Buffer; */

    @Column("clob")
    clob: string;

    @Column("nclob")
    nclob: string;

    // -------------------------------------------------------------------------
    // TypeOrm Specific Type
    // -------------------------------------------------------------------------

    @Column("simple-array")
    simpleArray: string[];

}
