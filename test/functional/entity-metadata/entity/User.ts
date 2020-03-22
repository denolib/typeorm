import {Column} from "../../../../src/decorator/columns/Column.ts";
import {PrimaryGeneratedColumn} from "../../../../src/decorator/columns/PrimaryGeneratedColumn.ts";
import {Entity} from "../../../../src/decorator/entity/Entity.ts";
import {ManyToMany} from "../../../../src/decorator/relations/ManyToMany.ts";
import {Post} from "./Post.ts";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: String })
    name!: string;

    @ManyToMany(type => Post, post => post.counters.likedUsers)
    likedPosts!: Post[];

}
