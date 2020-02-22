import {Column} from "../../../../src/decorator/columns/Column.ts";
import {Person, PersonType} from "./Person.ts";
import {ChildEntity} from "../../../../src/decorator/entity/ChildEntity.ts";

@ChildEntity(PersonType.Homesitter) // required
export class Homesitter extends Person {

    @Column({ type: Number })
    numberOfKids: number;

    @Column({ type: String })
    shared: string;

    constructor() {
        super();
        this.type = 2;
    }

}
