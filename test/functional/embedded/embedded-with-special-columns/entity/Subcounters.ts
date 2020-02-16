import {Column} from "../../../../../src/decorator/columns/Column.ts";
import {VersionColumn} from "../../../../../src/decorator/columns/VersionColumn.ts";

export class Subcounters {

    @VersionColumn({ type: Number })
    version: number;

    @Column({ type: Number })
    watches: number;

}
