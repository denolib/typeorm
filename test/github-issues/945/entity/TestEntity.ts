import {Entity} from "../../../../src/decorator/entity/Entity.ts";
import {PrimaryColumn} from "../../../../src/decorator/columns/PrimaryColumn.ts";
import {Column} from "../../../../src/decorator/columns/Column.ts";

@Entity("test_entity")
export class TestEntity {

    @PrimaryColumn({ type: String })
    id1!: string;

    @PrimaryColumn({ type: String })
    id2!: string;

    @Column({ type: String })
    name!: string;

}
