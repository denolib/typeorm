import {Entity} from "../../../../../../../src/decorator/entity/Entity.ts";
import {PrimaryColumn} from "../../../../../../../src/decorator/columns/PrimaryColumn.ts";
import {Post} from "./Post.ts";
import {ManyToOne} from "../../../../../../../src/decorator/relations/ManyToOne.ts";

@Entity()
export class Category {

    @PrimaryColumn({ type: Number })
    id: number;

    @PrimaryColumn({ type: String })
    name: string;

    @ManyToOne(type => Post, post => post.counters.categories)
    post: Post;

}
