import {Entity} from "../../../../../src/decorator/entity/Entity.ts";
import {OneToMany} from "../../../../../src/decorator/relations/OneToMany.ts";
import {PrimaryColumn} from "../../../../../src/decorator/columns/PrimaryColumn.ts";
import {Column} from "../../../../../src/decorator/columns/Column.ts";
import {Post} from "./Post.ts";

@Entity()
export class User {

    @PrimaryColumn({ type: Number })
    id: number;

    @PrimaryColumn({ type: Number })
    personId: number;

    @Column({ type: String })
    name: string;

    @OneToMany(type => Post, post => post.counters.likedUser)
    likedPosts: Post[];

}
