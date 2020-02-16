import {Entity} from "../../../../../../src/decorator/entity/Entity.ts";
import {PrimaryColumn} from "../../../../../../src/decorator/columns/PrimaryColumn.ts";
import {Column} from "../../../../../../src/decorator/columns/Column.ts";

@Entity()
export class Post {

    @PrimaryColumn({ type: Number })
    id: number;

    @Column("character varying", {
        length: 50
    })
    characterVarying: string;

    @Column("varchar", {
        length: 50
    })
    varchar: string;

    @Column("character", {
        length: 50
    })
    character: string;

    @Column("char", {
        length: 50
    })
    char: string;

}
