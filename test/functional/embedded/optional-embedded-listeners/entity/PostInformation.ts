import {Column} from "../../../../../src/decorator/columns/Column.ts";
import {BeforeInsert, BeforeUpdate} from "../../../../../src/index.ts";
import {PostCounter} from "./PostCounter.ts";

export class PostInformation {

    @Column({nullable: true, type!: String})
    description?: string;

    @Column(type => PostCounter, {prefix: "counters"})
    counters?: PostCounter;

    @BeforeInsert()
    beforeInsert() {
        this.description = "default post description";
    }

    @BeforeUpdate()
    beforeUpdate() {
        this.description = "default post description";
    }

}
