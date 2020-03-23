import {Column} from "../../../../../src/decorator/columns/Column.ts";
import {PrimaryColumn} from "../../../../../src/decorator/columns/PrimaryColumn.ts";

export class Counters {

    @PrimaryColumn({ type: Number })
    code!: number;

    @Column({ type: Number })
    likes!: number;

    @Column({ type: Number })
    comments!: number;

    @Column({ type: Number })
    favorites!: number;

}
