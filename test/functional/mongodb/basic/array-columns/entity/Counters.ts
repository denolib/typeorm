import {Column} from "../../../../../../src/decorator/columns/Column.ts";

export class Counters {

    @Column({ type: Number })
    likes!: number;

    @Column({ type: String })
    text!: string;

    constructor(likes: number, text: string) {
        this.likes = likes;
        this.text = text;
    }

}
