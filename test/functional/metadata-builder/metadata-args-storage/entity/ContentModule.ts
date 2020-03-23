import {Column} from "../../../../../src/decorator/columns/Column.ts";
import {Unit} from "./Unit.ts";

export class ContentModule extends Unit {

    @Column({ type: String })
    tag!: string;

}
