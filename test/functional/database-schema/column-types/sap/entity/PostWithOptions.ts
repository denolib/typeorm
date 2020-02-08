import {Entity} from "../../../../../../src/index.ts";
import {PrimaryColumn} from "../../../../../../src/index.ts";
import {Column} from "../../../../../../src/index.ts";

@Entity()
export class PostWithOptions {

    @PrimaryColumn({ type: Number })
    id: number;

    // -------------------------------------------------------------------------
    // Numeric Types
    // -------------------------------------------------------------------------

    @Column("dec", { precision: 10, scale: 2 })
    dec: string;

    @Column("decimal", { precision: 10, scale: 3 })
    decimal: string;

    // -------------------------------------------------------------------------
    // Character Types
    // -------------------------------------------------------------------------

    @Column("varchar", { length: 50 })
    varchar: string;

    @Column("nvarchar", { length: 50 })
    nvarchar: string;

    @Column("alphanum", { length: 50 })
    alphanum: string;

    @Column("shorttext", { length: 50 })
    shorttext: string;

}
