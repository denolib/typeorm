import {Entity} from "../../../../../../../src/decorator/entity/Entity.ts";
import {ManyToMany} from "../../../../../../../src/decorator/relations/ManyToMany.ts";
import {PrimaryColumn} from "../../../../../../../src/decorator/columns/PrimaryColumn.ts";
import {Post} from "./Post.ts";

@Entity()
export class Category {

    @PrimaryColumn({ type: Number })
    id!: number;

    @PrimaryColumn({ type: String })
    name!: string;

    @ManyToMany(type => Post, post => post.counters.categories)
    posts!: Post[];

    postIds!: number[];

}
