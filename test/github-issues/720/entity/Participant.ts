import {Entity} from "../../../../src/decorator/entity/Entity.ts";
import {PrimaryColumn} from "../../../../src/decorator/columns/PrimaryColumn.ts";
import {Column} from "../../../../src/decorator/columns/Column.ts";

@Entity("participants")
export class Participant {

    @PrimaryColumn({ type: Number })
    order_id!: number;

    @PrimaryColumn({ type: String })
    distance!: string;

    @Column({ type!: String })
    price?: string;

}
