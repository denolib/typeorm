import {PrimaryColumn} from "../../../../../../src/decorator/columns/PrimaryColumn.ts";
import {Entity} from "../../../../../../src/decorator/entity/Entity.ts";
import {Column} from "../../../../../../src/decorator/columns/Column.ts";
import {ManyToOne} from "../../../../../../src/decorator/relations/ManyToOne.ts";
import {OneToMany} from "../../../../../../src/decorator/relations/OneToMany.ts";
import {RelationCount} from "../../../../../../src/decorator/relations/RelationCount.ts";
import {Image} from "./Image.ts";
import {Post} from "./Post.ts";

@Entity()
export class Category {

    @PrimaryColumn({ type: Number })
    id!: number;

    @Column({ type: String })
    name!: string;

    @Column({ type: Boolean })
    isRemoved: boolean = false;

    @ManyToOne(type => Post, post => post.categories)
    post!: Post;

    @OneToMany(type => Image, image => image.category)
    images!: Image[];

    @RelationCount((category: Category) => category.images)
    imageCount!: number;

    @RelationCount((category: Category) => category.images, "removedImages", qb => qb.andWhere("removedImages.isRemoved = :isRemoved", { isRemoved: true }))
    removedImageCount!: number;

}
