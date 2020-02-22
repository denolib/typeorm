import { Entity } from "../../../../src/decorator/entity/Entity.ts";
import { PrimaryColumn } from "../../../../src/decorator/columns/PrimaryColumn.ts";
import { Column } from "../../../../src/decorator/columns/Column.ts";
import { OneToMany } from "../../../../src/decorator/relations/OneToMany.ts";

import { Detail } from "./detail.ts";

@Entity()
export class Master {

    @PrimaryColumn({
        type: String,
        length: 20
    })
    id: string;

    @Column({
        type: String,
        nullable: false,
        length: 150
    })
    description: string;

    @OneToMany(type => Detail, detail => detail.master)
    details: Detail[];

}
