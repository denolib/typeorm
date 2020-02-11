import {Column} from "../../../../../src/decorator/columns/Column.ts";

export class Counters {

    @Column({ type: Number })
    stars: number;

    @Column({ type: Number })
    commentCount: number;

    @Column({ type: String })
    metadata: string;

}
