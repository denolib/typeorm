import {Entity} from "../../../../src/decorator/entity/Entity.ts";
import {PrimaryColumn} from "../../../../src/decorator/columns/PrimaryColumn.ts";
import {Column} from "../../../../src/decorator/columns/Column.ts";
import {Index} from "../../../../src/decorator/Index.ts";

@Index("Groups name", ["name"], { unique: true })
@Entity("groups")
export class Group {

    @PrimaryColumn({ type: Number })
    id: number;

    @Column({ type: String })
    name: string;

}
