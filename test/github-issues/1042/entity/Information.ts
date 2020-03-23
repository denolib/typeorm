import {Column} from "../../../../src/decorator/columns/Column.ts";

export class Information {

    @Column({ type: String })
    maritalStatus!: string;

    @Column({ type: String })
    gender!: string;

    @Column({ type: String })
    address!: string;

}
