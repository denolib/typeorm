import {Column} from "../../../../../../../src/decorator/columns/Column.ts";
import {TableInheritance} from "../../../../../../../src/decorator/entity/TableInheritance.ts";
import {Entity} from "../../../../../../../src/decorator/entity/Entity.ts";
import {PrimaryGeneratedColumn} from "../../../../../../../src/decorator/columns/PrimaryGeneratedColumn.ts";

@Entity()
@TableInheritance({ column: { name: "type", type: "varchar" } })
export class Person {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: String })
    name: string;

}
