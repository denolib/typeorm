import {Column} from "../../../../../../../src/decorator/columns/Column.ts";
import {ChildEntity} from "../../../../../../../src/decorator/entity/ChildEntity.ts";
import {Person} from "./Person.ts";

@ChildEntity()
export class Employee extends Person {

    @Column({ type: Number })
    salary!: number;

}
