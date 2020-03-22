import {Column} from "../../../../../../src/decorator/columns/Column.ts";
import {Index} from "../../../../../../src/decorator/Index.ts";

export class Information {

    @Column({ type: String })
    description!: string;

    @Column({ type!: Number })
    @Index("post_likes")
    likes!: number;

}
