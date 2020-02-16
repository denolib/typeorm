import {ChildEntity} from "../../../../../../../src/decorator/entity/ChildEntity.ts";
import {ManyToMany} from "../../../../../../../src/decorator/relations/ManyToMany.ts";
import {JoinTable} from "../../../../../../../src/decorator/relations/JoinTable.ts";
import {Employee} from "./Employee.ts";
import {Department} from "./Department.ts";

@ChildEntity()
export class Accountant extends Employee {

    @ManyToMany(type => Department, department => department.accountants)
    @JoinTable()
    departments: Department[];

}
