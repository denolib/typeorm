import {Column} from "../../../../../src/decorator/columns/Column.ts";
import {PostCounter} from "./PostCounter.ts";
import {BeforeInsert} from "../../../../../src/decorator/listeners/BeforeInsert.ts";
import {Index} from "../../../../../src/decorator/Index.ts";

export class PostInformation {

    @Column({ type: String })
    @Index()
    description: string;

    @Column(type => PostCounter, { prefix: "counters" } )
    counters: PostCounter = new PostCounter();

    @BeforeInsert()
    beforeInsert() {
        this.description = "default post description";
    }

}
