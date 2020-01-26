import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "../../../src/index.ts";
import {Post} from "./Post.ts";

@Entity("sample3_post_author")
export class PostAuthor {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: String })
    name: string;

    @OneToMany(type => Post, post => post.author)
    posts: Post[];

}
