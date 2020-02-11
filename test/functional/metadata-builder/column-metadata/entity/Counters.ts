import {Column} from "../../../../../src/decorator/columns/Column.ts";
import {Subcounters} from "./Subcounters.ts";

export class Counters {

    @Column({ type: Number })
    code: number;

    @Column({ type: Number })
    likes: number;

    @Column({ type: Number })
    comments: number;

    @Column({ type: Number })
    favorites: number;

    @Column(() => Subcounters)
    subcounters: Subcounters;

}
