import {Column} from "../../../../../src/decorator/columns/Column.ts";
import {Entity} from "../../../../../src/decorator/entity/Entity.ts";
import {ManyToMany} from "../../../../../src/decorator/relations/ManyToMany.ts";
import {Post} from "./Post.ts";
import {PrimaryColumn} from "../../../../../src/decorator/columns/PrimaryColumn.ts";

@Entity()
export class User {

    @PrimaryColumn({ type: Number })
    id!: number;

    @PrimaryColumn({ type: Number })
    personId!: number;

    @Column({ type: String })
    name!: string;

    @ManyToMany(type => Post, post => post.counters.likedUsers)
    likedPosts!: Post[];

}
