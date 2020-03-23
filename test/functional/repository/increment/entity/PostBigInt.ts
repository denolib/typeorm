import { Entity } from "../../../../../src/decorator/entity/Entity.ts";
import { Column } from "../../../../../src/decorator/columns/Column.ts";
import { PrimaryColumn } from "../../../../../src/decorator/columns/PrimaryColumn.ts";

@Entity()
export class PostBigInt {

    @PrimaryColumn({ type: Number })
    id!: number;

    @Column({ type: String })
    title!: string;

    @Column("bigint", {
        unsigned!: true
    })
    counter!: string;

}
