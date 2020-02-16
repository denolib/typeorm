import {Column} from "../../../../../../src/decorator/columns/Column.ts";
import {Information} from "./Information.ts";
import {BeforeInsert} from "../../../../../../src/index.ts";

export class Counters {

    @Column({ type: Number })
    likes: number;

    @Column(type => Information)
    information?: Information;

    @BeforeInsert()
    beforeInsert() {
        this.likes = 100;
    }
}
