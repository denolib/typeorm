import {PrimaryColumn} from "../../../../../../src/decorator/columns/PrimaryColumn.ts";
import {Entity} from "../../../../../../src/decorator/entity/Entity.ts";
import {Column} from "../../../../../../src/decorator/columns/Column.ts";
import {ManyToMany} from "../../../../../../src/decorator/relations/ManyToMany.ts";
import {JoinTable} from "../../../../../../src/decorator/relations/JoinTable.ts";
import {Post} from "./Post.ts";
import {Image} from "./Image.ts";
import {RelationId} from "../../../../../../src/decorator/relations/RelationId.ts";

@Entity()
export class Category {

    @PrimaryColumn({ type: Number })
    id: number;

    @Column({ type: String })
    name: string;

    @Column({ type: Boolean })
    isRemoved: boolean = false;

    @ManyToMany(type => Post, post => post.categories)
    posts: Post[];

    @ManyToMany(type => Image)
    @JoinTable()
    images: Image[];

    @RelationId((category: Category) => category.images)
    imageIds: number[];

    @RelationId((category: Category) => category.images, "removedImages", qb => qb.andWhere("removedImages.isRemoved = :isRemoved", { isRemoved: true }))
    removedImageIds: number[];

    @RelationId((category: Category) => category.posts)
    postIds: number[];

    @RelationId((category: Category) => category.posts, "removedPosts", qb => qb.andWhere("removedPosts.isRemoved = :isRemoved", { isRemoved: true }))
    removedPostIds: number[];

}
