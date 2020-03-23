import {Column} from "../../../../../src/decorator/columns/Column.ts";
import {PrimaryColumn} from "../../../../../src/decorator/columns/PrimaryColumn.ts";
import {Entity} from "../../../../../src/decorator/entity/Entity.ts";
import {OneToMany} from "../../../../../src/decorator/relations/OneToMany.ts";
import {Post} from "./Post.ts";

@Entity()
export class User {

    @PrimaryColumn({ type: Number })
    id!: number;

    @Column({ type: String })
    name!: string;

    @OneToMany(type => Post, post => post.counters.likedUser)
    likedPosts!: Post[];

}
