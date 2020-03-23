import {Column} from "../../../../src/decorator/columns/Column.ts";
import {Person, PersonType} from "./Person.ts";
import {ChildEntity} from "../../../../src/decorator/entity/ChildEntity.ts";

@ChildEntity(PersonType.Student) // required
export class Student extends Person {

    @Column({ type: String })
    faculty!: string;

    constructor() {
        super();
        this.type = 3;
    }

}
