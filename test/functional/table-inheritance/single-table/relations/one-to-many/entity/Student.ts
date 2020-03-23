import {ChildEntity} from "../../../../../../../src/decorator/entity/ChildEntity.ts";
import {OneToMany} from "../../../../../../../src/decorator/relations/OneToMany.ts";
import {Person} from "./Person.ts";
import {Faculty} from "./Faculty.ts";

@ChildEntity()
export class Student extends Person {

    @OneToMany(type => Faculty, faculty => faculty.student)
    faculties!: Faculty[];

}
