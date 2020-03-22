import {ChildEntity, Column} from "../../../../../../src/index.ts";

import {Person} from "./Person.ts";

@ChildEntity()
export class Employee extends Person {

    @Column({ type: Number })
    salary!: number;

}
