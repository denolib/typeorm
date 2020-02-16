import {Column} from "../../../../src/decorator/columns/Column.ts";
import {Person} from "./Person.ts";
import {ChildEntity} from "../../../../src/decorator/entity/ChildEntity.ts";

@ChildEntity()
export class Employee extends Person {

    @Column({ type: Number })
    salary: number;

}
