import {Column, Entity} from "../../../src/index.ts";
import {PrimaryColumn} from "../../../src/decorator/columns/PrimaryColumn.ts";
import {Generated} from "../../../src/decorator/Generated.ts";

@Entity("sample01_post")
export class Post {

    @PrimaryColumn("integer")
    @Generated()
    id: number;

    @Column({ type: String })
    title: string;

    @Column({ type: String })
    text: string;

    @Column({ nullable: false, type: Number })
    likesCount: number;

}
