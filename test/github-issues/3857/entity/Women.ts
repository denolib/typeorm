import {Person} from "./Person.ts";
import {ChildEntity, Column} from "../../../../src/index.ts";

@ChildEntity()
export class Women extends Person {

    @Column("int")
    brassiereSize: number;
}
