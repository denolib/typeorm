import {Entity} from "../../../../../../src/index.ts";
import {PrimaryColumn} from "../../../../../../src/index.ts";
import {Column} from "../../../../../../src/index.ts";

@Entity()
export class Post {

    @PrimaryColumn({ type: Number })
    id!: number;

    @Column("varchar", {
        length!: 50
    })
    varchar!: string;

    @Column("nvarchar", {
        length!: 50
    })
    nvarchar!: string;

    @Column("alphanum", {
        length!: 50
    })
    alphanum!: string;

    @Column("shorttext", {
        length!: 50
    })
    shorttext!: string;

    @Column("varbinary", {
        length!: 50
    })
    varbinary!: Uint8Array;/*Buffer;*/

}
