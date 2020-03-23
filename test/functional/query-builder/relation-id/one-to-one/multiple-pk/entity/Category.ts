import {Entity} from "../../../../../../../src/decorator/entity/Entity.ts";
import {Column} from "../../../../../../../src/decorator/columns/Column.ts";
import {PrimaryColumn} from "../../../../../../../src/decorator/columns/PrimaryColumn.ts";
import {Post} from "./Post.ts";
import {Image} from "./Image.ts";
import {OneToOne} from "../../../../../../../src/decorator/relations/OneToOne.ts";
import {JoinColumn} from "../../../../../../../src/decorator/relations/JoinColumn.ts";

@Entity()
export class Category {

    @PrimaryColumn({ type: Number })
    id!: number;

    @PrimaryColumn({ type: Number })
    code!: number;

    @Column({ type: String })
    name!: string;

    @Column({ type: Boolean })
    isRemoved: boolean = false;

    @OneToOne(type => Post, post => post.category)
    post!: Post;

    @OneToOne(type => Image, image => image.category)
    @JoinColumn()
    image!: Image;

    postId!: number;

    imageId!: number;

}
