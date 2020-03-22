import {Entity} from "../../../../src/decorator/entity/Entity.ts";
import {Column} from "../../../../src/decorator/columns/Column.ts";
import {ManyToOne} from "../../../../src/decorator/relations/ManyToOne.ts";
import {Post} from "./Post.ts";
import {PrimaryColumn} from "../../../../src/decorator/columns/PrimaryColumn.ts";
import {RelationId} from "../../../../src/decorator/relations/RelationId.ts";

@Entity()
export class Category {

    @PrimaryColumn({ type: Number })
    firstId!: number;

    @PrimaryColumn({ type: Number })
    secondId!: number;

    @Column({ type: String })
    name!: string;

    @ManyToOne(type => Post, post => post.categories)
    post!: Post;

    @RelationId((category: Category) => category.post)
    postId!: number;

}
