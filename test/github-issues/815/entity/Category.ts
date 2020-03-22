import {Entity} from "../../../../src/decorator/entity/Entity.ts";
import {Column} from "../../../../src/decorator/columns/Column.ts";
import {ManyToOne} from "../../../../src/decorator/relations/ManyToOne.ts";
import {Post} from "./Post.ts";
import {RelationId} from "../../../../src/decorator/relations/RelationId.ts";
import {PrimaryColumn} from "../../../../src/decorator/columns/PrimaryColumn.ts";
import {ManyToMany} from "../../../../src/decorator/relations/ManyToMany.ts";

@Entity()
export class Category {

    @PrimaryColumn({ type: Number })
    firstId!: number;

    @PrimaryColumn({ type: Number })
    secondId!: number;

    @Column({ type: String })
    name!: string;

    @ManyToOne(type => Post, post => post.categories)
    post!: Post|null;

    @RelationId((category: Category) => category.post)
    postId!: number;

    @ManyToMany(type => Post, post => post.manyCategories)
    manyPosts!: Post[];

    @RelationId((category: Category) => category.manyPosts)
    manyPostIds!: number[];

}

