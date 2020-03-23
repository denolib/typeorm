import {Column} from "../../../../../src/decorator/columns/Column.ts";

export class Subcounters {

    @Column({ type: Number })
    version!: number;

    @Column({ type: Number })
    watches!: number;

}
