import {Entity} from "../../../../../../src/decorator/entity/Entity.ts";
import {PrimaryColumn} from "../../../../../../src/decorator/columns/PrimaryColumn.ts";
import {Column} from "../../../../../../src/decorator/columns/Column.ts";

@Entity()
export class Post {

    @PrimaryColumn({ type: Number })
    id!: number;

    @Column("int", { width: 10 })
    int!: number;

    @Column("tinyint", { width: 2 })
    tinyint!: number;

    @Column("smallint", { width: 3 })
    smallint!: number;

    @Column("mediumint", { width: 9 })
    mediumint!: number;

    @Column("bigint", { width: 10 })
    bigint!: number;

}
