import { Column } from "../../../../../src/decorator/columns/Column.ts";
import { Information } from "./Information.ts";

export class SimpleCounters {

    @Column({ type: Number })
    likes: number;

    @Column({ type: Number })
    comments: number;

    @Column({ type: Number })
    favorites: number;

    @Column(type => Information, { prefix: "info" })
    information: Information;
}
