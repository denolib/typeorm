import {Person} from "./Person.ts";
import {ChildEntity, Column} from "../../../../src/index.ts";

@ChildEntity()
export class Men extends Person {

    @Column("varchar")
    beardColor!: string;
}
