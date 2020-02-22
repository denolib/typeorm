import {Column} from "../../../../src/decorator/columns/Column.ts";
import {TableInheritance} from "../../../../src/decorator/entity/TableInheritance.ts";
import {Entity} from "../../../../src/decorator/entity/Entity.ts";
import {PrimaryColumn} from "../../../../src/decorator/columns/PrimaryColumn.ts";

export enum PersonType {
    Employee = 1,
    Homesitter = 2,
    Student = 3
}

@Entity("issue184_person")
@TableInheritance({ column: { name: "type", type: "int"} })
export abstract class Person  {

    @PrimaryColumn({ type: String })
    id: string;

    @Column({ type: String })
    firstName: string;

    @Column({ type: String })
    lastName: string;

    type: PersonType;

}
