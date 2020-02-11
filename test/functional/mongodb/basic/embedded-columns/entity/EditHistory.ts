import {Column} from "../../../../../../src/decorator/columns/Column.ts";

export class EditHistory {

    @Column({ type: String })
    title: string;

    @Column({ type: String })
    text: string;

}
