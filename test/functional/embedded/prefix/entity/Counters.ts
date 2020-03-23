import {Column} from "../../../../../src/decorator/columns/Column.ts";

export class Counters {

    @Column({ name: "_likes", type: Number })
    likes!: number;

    @Column({ name: "_comments", type: Number })
    comments!: number;

    @Column({ name: "_favorites", type: Number })
    favorites!: number;

}
