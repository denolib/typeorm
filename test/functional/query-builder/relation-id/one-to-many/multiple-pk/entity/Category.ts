import {Entity} from "../../../../../../../src/decorator/entity/Entity.ts";
import {Column} from "../../../../../../../src/decorator/columns/Column.ts";
import {PrimaryColumn} from "../../../../../../../src/decorator/columns/PrimaryColumn.ts";
import {ManyToOne} from "../../../../../../../src/decorator/relations/ManyToOne.ts";
import {OneToMany} from "../../../../../../../src/decorator/relations/OneToMany.ts";
import {Post} from "./Post.ts";
import {Image} from "./Image.ts";

@Entity()
export class Category {

    @PrimaryColumn({ type: Number })
    id: number;

    @PrimaryColumn({ type: Number })
    code: number;

    @Column({ type: String })
    name: string;

    @Column({ type: Boolean })
    isRemoved: boolean = false;

    @ManyToOne(type => Post, post => post.categories)
    post: Post;

    @OneToMany(type => Image, image => image.category)
    images: Image[];

    postId: number;

    imageIds: number[];

}
