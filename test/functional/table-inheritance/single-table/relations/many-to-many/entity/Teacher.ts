import {ChildEntity} from "../../../../../../../src/decorator/entity/ChildEntity.ts";
import {ManyToMany} from "../../../../../../../src/decorator/relations/ManyToMany.ts";
import {JoinTable} from "../../../../../../../src/decorator/relations/JoinTable.ts";
import {Employee} from "./Employee.ts";
import {Specialization} from "./Specialization.ts";

@ChildEntity()
export class Teacher extends Employee {

    @ManyToMany(type => Specialization, specialization => specialization.teachers)
    @JoinTable({ name: "person_specs" })
    specializations: Specialization[];

}
