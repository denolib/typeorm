import {Column} from "../../../../../../src/decorator/columns/Column.ts";
import {ChildEntity} from "../../../../../../src/decorator/entity/ChildEntity.ts";
import {Employee} from "./Employee.ts";

@ChildEntity()
export class Teacher extends Employee {

    @Column({ type: String })
    specialization!: string;

}
