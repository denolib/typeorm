import {Column} from "../../../../../../src/decorator/columns/Column.ts";
import {PrimaryColumn} from "../../../../../../src/decorator/columns/PrimaryColumn.ts";
import {Entity} from "../../../../../../src/decorator/entity/Entity.ts";
import {OneToOne} from "../../../../../../src/decorator/relations/OneToOne.ts";
import {RelationId} from "../../../../../../src/decorator/relations/RelationId.ts";
import {Post} from "./Post.ts";

@Entity()
export class Category {

    @PrimaryColumn({ type: Number })
    id: number;

    @Column({ unique: true, type: String })
    name: string;

    @OneToOne(type => Post, post => post.category2)
    post: Post;

    @RelationId((category: Category) => category.post)
    postId: number;

}
