import {Entity} from "../../../../../src/decorator/entity/Entity.ts";
import {Column} from "../../../../../src/decorator/columns/Column.ts";
import {PostEmbedded} from "./PostEmbedded.ts";
import {PrimaryColumn} from "../../../../../src/decorator/columns/PrimaryColumn.ts";

@Entity()
export class PostComplex {

    @PrimaryColumn({ type: Number })
    firstId!: number;

    @Column({ default: "Hello Complexity", type: String })
    text!: string;

    @Column(type => PostEmbedded)
    embed!: PostEmbedded;

}
