import {ChildEntity} from "../../../../../../../src/decorator/entity/ChildEntity.ts";
import {OneToMany} from "../../../../../../../src/decorator/relations/OneToMany.ts";
import {Employee} from "./Employee.ts";
import {Department} from "./Department.ts";

@ChildEntity()
export class Accountant extends Employee {

    @OneToMany(type => Department, department => department.accountant)
    departments!: Department[];

}
