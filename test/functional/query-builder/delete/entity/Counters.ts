import {Column} from "../../../../../src/decorator/columns/Column.ts";

export class Counters {

    @Column({ default: 1, type: Number })
    likes!: number;

    @Column({ nullable: true, type: Number })
    favorites!: number;

    @Column({ default: 0, type: Number })
    comments!: number;

}
