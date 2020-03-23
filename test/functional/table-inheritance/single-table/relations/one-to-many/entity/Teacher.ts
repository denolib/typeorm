import {ChildEntity} from "../../../../../../../src/decorator/entity/ChildEntity.ts";
import {OneToMany} from "../../../../../../../src/decorator/relations/OneToMany.ts";
import {Employee} from "./Employee.ts";
import {Specialization} from "./Specialization.ts";

@ChildEntity()
export class Teacher extends Employee {

    @OneToMany(type => Specialization, specialization => specialization.teacher)
    specializations!: Specialization[];

}
