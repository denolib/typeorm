import {Column} from "../../../../../src/decorator/columns/Column.ts";
import {Unit} from "./Unit.ts";

export class Content extends Unit {

    @Column({ type: String })
    name: string;

}
