import {Entity} from "../../../../../../../src/decorator/entity/Entity.ts";
import {PrimaryColumn} from "../../../../../../../src/decorator/columns/PrimaryColumn.ts";
import {ManyToMany} from "../../../../../../../src/decorator/relations/ManyToMany.ts";
import {Post} from "./Post.ts";

@Entity()
export class User {

    @PrimaryColumn({ type: Number })
    id!: number;

    @PrimaryColumn({ type: String })
    name!: string;

    @ManyToMany(type => Post, post => post.counters.subcntrs.watchedUsers)
    posts!: Post[];

    postIds!: number[];

}
