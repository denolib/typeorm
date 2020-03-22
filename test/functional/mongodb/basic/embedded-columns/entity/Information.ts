import {Column} from "../../../../../../src/decorator/columns/Column.ts";

export class Information {

    @Column({ type: String })
    description!: string;

    @Column({ type: Boolean })
    visible!: boolean;

    @Column({ type: Boolean })
    editable!: boolean;

}
