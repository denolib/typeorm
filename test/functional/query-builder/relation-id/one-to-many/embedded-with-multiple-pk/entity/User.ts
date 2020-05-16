import {Entity} from "../../../../../../../src/decorator/entity/Entity.ts";
import {PrimaryColumn} from "../../../../../../../src/decorator/columns/PrimaryColumn.ts";
import {ManyToOne} from "../../../../../../../src/decorator/relations/ManyToOne.ts";
import {Post} from "./Post.ts";

@Entity()
export class User {

    @PrimaryColumn({ type: Number })
    id!: number;

    @PrimaryColumn({ type: String })
    name!: string;

    @ManyToOne(type => Post, post => post.counters.subcounters.watchedUsers)
    post!: Post;

}
