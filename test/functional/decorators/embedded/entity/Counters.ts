import {Column} from "../../../../../src/decorator/columns/Column.ts";

export class Counters {

    @Column({ type: Number })
    likes!: number;

    @Column({ type: Number })
    comments!: number;

    @Column({ type: Number })
    favorites!: number;

}
