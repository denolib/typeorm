import {Column} from "../../../../src/decorator/columns/Column.ts";
import {Person, PersonType} from "./Person.ts";
import {ChildEntity} from "../../../../src/decorator/entity/ChildEntity.ts";

@ChildEntity(PersonType.Employee)
export class Employee extends Person {

    @Column({ type: Number })
    salary!: number;

    @Column({ type: String })
    shared!: string;

    constructor() {
        super();
        this.type = 1;
    }

}
