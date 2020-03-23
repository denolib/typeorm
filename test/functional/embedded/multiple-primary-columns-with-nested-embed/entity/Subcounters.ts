import {Column} from "../../../../../src/decorator/columns/Column.ts";
import {PrimaryColumn} from "../../../../../src/decorator/columns/PrimaryColumn.ts";

export class Subcounters {

    @PrimaryColumn({ type: Number })
    version!: number;

    @Column({ type: Number })
    watches!: number;

}
