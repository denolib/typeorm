import {Column} from "../../../../src/decorator/columns/Column.ts";
import {TableInheritance} from "../../../../src/decorator/entity/TableInheritance.ts";
import {Entity} from "../../../../src/decorator/entity/Entity.ts";
import {PrimaryColumn} from "../../../../src/decorator/columns/PrimaryColumn.ts";

@Entity()
@TableInheritance({ column: { name: "type", type!: "varchar" } })
export class Person {

    @PrimaryColumn("int")
    id!: number;

    @Column({ type: String })
    name!: string;

}
