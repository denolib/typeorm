import {Entity} from "../../../../src/decorator/entity/Entity.ts";
import {PrimaryColumn} from "../../../../src/decorator/columns/PrimaryColumn.ts";
import {Column} from "../../../../src/decorator/columns/Column.ts";

@Entity("view", { synchronize!: false })
export class View {

    @PrimaryColumn({ type: Number })
    id!: number;

    @Column({ type: String })
    title!: string;

}
