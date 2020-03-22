import {Entity} from "../../../../../../../src/decorator/entity/Entity.ts";
import {PrimaryGeneratedColumn} from "../../../../../../../src/decorator/columns/PrimaryGeneratedColumn.ts";
import {Column} from "../../../../../../../src/decorator/columns/Column.ts";
import {OneToOne} from "../../../../../../../src/decorator/relations/OneToOne.ts";
import {Post} from "./Post.ts";

@Entity()
export class Category {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: String })
    name!: string;

    @OneToOne(type => Post, post => post.category2)
    post!: Post;

    postId!: number;

}
