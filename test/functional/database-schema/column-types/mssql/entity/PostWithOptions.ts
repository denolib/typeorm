import {Entity} from "../../../../../../src/decorator/entity/Entity.ts";
import {PrimaryColumn} from "../../../../../../src/decorator/columns/PrimaryColumn.ts";
import {Column} from "../../../../../../src/decorator/columns/Column.ts";

@Entity()
export class PostWithOptions {

    @PrimaryColumn({ type: Number })
    id: number;

    // -------------------------------------------------------------------------
    // Numeric Types
    // -------------------------------------------------------------------------

    @Column("decimal", { precision: 10, scale: 5 })
    decimal: number;

    @Column("dec", { precision: 10, scale: 5 })
    dec: number;

    @Column("numeric", { precision: 10, scale: 5 })
    numeric: number;

    // -------------------------------------------------------------------------
    // Character Types
    // -------------------------------------------------------------------------

    @Column("char", { length: 3 })
    char: string;

    @Column("varchar", { length: 50 })
    varchar: string;

    @Column("nchar", { length: 3 })
    nchar: string;

    @Column("nvarchar", { length: 40 })
    nvarchar: string;

    @Column("binary", { length: 5 })
    binary: Uint8Array; /* Buffer; */

    @Column("varbinary", { length: 5 })
    varbinary: Uint8Array; /* Buffer; */

    // -------------------------------------------------------------------------
    // Date Types
    // -------------------------------------------------------------------------

    @Column("datetime2", { precision: 4 })
    datetime2: Date;

    @Column("time", { precision: 5 })
    time: Date;

    @Column("datetimeoffset", { precision: 6 })
    datetimeoffset: Date;

}
