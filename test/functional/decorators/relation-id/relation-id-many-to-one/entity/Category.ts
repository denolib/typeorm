import {PrimaryColumn} from "../../../../../../src/decorator/columns/PrimaryColumn.ts";
import {Entity} from "../../../../../../src/decorator/entity/Entity.ts";
import {Column} from "../../../../../../src/decorator/columns/Column.ts";

@Entity()
export class Category {

    @PrimaryColumn({ type: Number })
    id!: number;

    @Column({ unique: true, type: String })
    name!: string;

}
