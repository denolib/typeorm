import {ChildEntity} from "../../../../../../../src/decorator/entity/ChildEntity.ts";
import {ManyToMany} from "../../../../../../../src/decorator/relations/ManyToMany.ts";
import {Person} from "./Person.ts";
import {Faculty} from "./Faculty.ts";
import {JoinTable} from "../../../../../../../src/decorator/relations/JoinTable.ts";

@ChildEntity()
export class Student extends Person {

    @ManyToMany(type => Faculty, faculty => faculty.students)
    @JoinTable()
    faculties: Faculty[];

}
