import {Column} from "../../../../../src/decorator/columns/Column.ts";
import {PrimaryColumn} from "../../../../../src/decorator/columns/PrimaryColumn.ts";
import {Entity} from "../../../../../src/decorator/entity/Entity.ts";

@Entity()
export class Category {

    @PrimaryColumn({ type: Number })
    id!: number;

    @Column({ type: String })
    name!: string;

    constructor(id: number, name: string) {
        this.id = id;
        this.name = name;
    }

}
