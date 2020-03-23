import {Column} from "../../../../src/decorator/columns/Column.ts";

export class Contact {

    @Column({ type: String })
    name!: string;

    @Column({ type: String })
    email!: string;

}
