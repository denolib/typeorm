import {Column} from "../../../../../src/decorator/columns/Column.ts";
import {CreateDateColumn} from "../../../../../src/decorator/columns/CreateDateColumn.ts";
import {UpdateDateColumn} from "../../../../../src/decorator/columns/UpdateDateColumn.ts";
import {Subcounters} from "./Subcounters.ts";

export class Counters {

    @Column({ type: Number })
    likes!: number;

    @Column({ type: Number })
    comments!: number;

    @Column({ type: Number })
    favorites!: number;

    @Column(() => Subcounters, { prefix: "subcnt" })
    subcounters!: Subcounters;

    @CreateDateColumn()
    createdDate!: Date;

    @UpdateDateColumn()
    updatedDate!: Date;

}
