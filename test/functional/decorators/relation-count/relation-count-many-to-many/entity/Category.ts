import {PrimaryColumn} from "../../../../../../src/decorator/columns/PrimaryColumn.ts";
import {Entity} from "../../../../../../src/decorator/entity/Entity.ts";
import {Column} from "../../../../../../src/decorator/columns/Column.ts";
import {ManyToMany} from "../../../../../../src/decorator/relations/ManyToMany.ts";
import {JoinTable} from "../../../../../../src/decorator/relations/JoinTable.ts";
import {RelationCount} from "../../../../../../src/decorator/relations/RelationCount.ts";
import {Post} from "./Post.ts";
import {Image} from "./Image.ts";

@Entity()
export class Category {

    @PrimaryColumn({ type: Number })
    id!: number;

    @Column({ type: String })
    name!: string;

    @Column({ type: Boolean })
    isRemoved: boolean = false;

    @ManyToMany(type => Post, post => post.categories)
    posts!: Post[];

    @ManyToMany(type => Image, image => image.categories)
    @JoinTable()
    images!: Image[];

    @RelationCount((category: Category) => category.posts)
    postCount!: number;

    @RelationCount((category: Category) => category.posts, "removedPosts", qb => qb.andWhere("removedPosts.isRemoved = :isRemoved", { isRemoved: true }))
    removedPostCount!: number;

    @RelationCount((category: Category) => category.images)
    imageCount!: number;

    @RelationCount((category: Category) => category.images, "removedImages", qb => qb.andWhere("removedImages.isRemoved = :isRemoved", { isRemoved: true }))
    removedImageCount!: number;

}
