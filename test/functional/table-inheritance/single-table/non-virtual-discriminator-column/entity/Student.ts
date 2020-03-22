import {Column} from "../../../../../../src/decorator/columns/Column.ts";
import {ChildEntity} from "../../../../../../src/decorator/entity/ChildEntity.ts";
import {Person} from "./Person.ts";

@ChildEntity("student-type")
export class Student extends Person {

    @Column({ type: String })
    faculty!: string;

}
