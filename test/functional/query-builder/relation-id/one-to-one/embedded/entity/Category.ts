import {Entity} from "../../../../../../../src/decorator/entity/Entity.ts";
import {Column} from "../../../../../../../src/decorator/columns/Column.ts";
import {PrimaryGeneratedColumn} from "../../../../../../../src/decorator/columns/PrimaryGeneratedColumn.ts";
import {Post} from "./Post.ts";
import {OneToOne} from "../../../../../../../src/decorator/relations/OneToOne.ts";

@Entity()
export class Category {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: String })
    name!: string;

    @OneToOne(type => Post, post => post.counters.category)
    post!: Post;

    postId!: number;

}
