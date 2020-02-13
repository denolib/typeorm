import {Entity} from "../../../../../../../src/decorator/entity/Entity.ts";
import {Column} from "../../../../../../../src/decorator/columns/Column.ts";
import {ManyToMany} from "../../../../../../../src/decorator/relations/ManyToMany.ts";
import {PrimaryGeneratedColumn} from "../../../../../../../src/decorator/columns/PrimaryGeneratedColumn.ts";
import {Post} from "./Post.ts";

@Entity()
export class Category {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: String })
    name: string;

    @ManyToMany(type => Post, post => post.counters.categories)
    posts: Post[];

    postIds: number[];

}
