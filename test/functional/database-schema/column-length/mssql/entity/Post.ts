import {Entity} from "../../../../../../src/decorator/entity/Entity.ts";
import {PrimaryColumn} from "../../../../../../src/decorator/columns/PrimaryColumn.ts";
import {Column} from "../../../../../../src/decorator/columns/Column.ts";

@Entity()
export class Post {

    @PrimaryColumn({ type: Number })
    id!: number;

    @Column("char", {
        length!: 50
    })
    char!: string;

    @Column("varchar", {
        length!: 50
    })
    varchar!: string;

    @Column("nchar", {
        length!: 50
    })
    nchar!: string;

    @Column("nvarchar", {
        length!: 50
    })
    nvarchar!: string;

    @Column("binary", {
        length!: 50
    })
    binary!: Uint8Array;/* Buffer; */

    @Column("varbinary", {
        length!: 50
    })
    varbinary!: Uint8Array;/* Buffer; */

}
