import {Column} from "../../../../src/decorator/columns/Column.ts";
import {Person} from "./Person.ts";
import {ChildEntity} from "../../../../src/decorator/entity/ChildEntity.ts";

@ChildEntity()
export class Student extends Person {

    @Column({ type: String })
    faculty!: string;

}
