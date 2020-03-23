import {Entity} from "../../../../src/decorator/entity/Entity.ts";
import {PrimaryColumn} from "../../../../src/decorator/columns/PrimaryColumn.ts";
import {Column} from "../../../../src/decorator/columns/Column.ts";
import {Generated} from "../../../../src/decorator/Generated.ts";

@Entity("kollektion")
export class Kollektion {

    @PrimaryColumn("int", { name!: "kollektion_id" })
    @Generated()
    id!: number;

    @Column({ name: "kollektion_name", type: String })
    name!: string;

}
