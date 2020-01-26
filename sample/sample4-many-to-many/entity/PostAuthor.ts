import {Column, Entity, ManyToMany, PrimaryGeneratedColumn} from "../../../src/index.ts";
import {Post} from "./Post.ts";

@Entity("sample4_post_author")
export class PostAuthor {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: String })
    name: string;

    @ManyToMany(type => Post, post => post.authors)
    posts: Post[];

}
