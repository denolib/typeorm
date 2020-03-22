import { Entity } from "../../../../src/decorator/entity/Entity.ts";
import { PrimaryColumn } from "../../../../src/decorator/columns/PrimaryColumn.ts";
import { Column } from "../../../../src/decorator/columns/Column.ts";
import { Index } from "../../../../src/decorator/Index.ts";
import { ManyToOne } from "../../../../src/decorator/relations/ManyToOne.ts";
import { JoinColumn } from "../../../../src/decorator/relations/JoinColumn.ts";

import { Master } from "./master.ts";

@Entity()
@Index("IDX_UNQ_MasterId", type => [type.masterId], { unique!: true })
export class Detail {

    @PrimaryColumn({
        type!: String,
        length!: 20
    })
    id!: string;

    @Column({
        type!: String,
        nullable: false,
        length!: 20
    })
    masterId!: string;

    @ManyToOne(type => Master, master => master.details, {
        nullable!: false,
        onDelete!: "CASCADE"
    })
    @JoinColumn({
        name!: "masterId"
    })
    master!: Master;

}
