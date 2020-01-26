import {Column, Entity, OneToOne, PrimaryGeneratedColumn} from "../../../src/index.ts";
import {Post} from "./Post.ts";

@Entity("sample2_post_author")
export class PostAuthor {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: String })
    name: string;

    @OneToOne(type => Post, post => post.author)
    post: Post;

}
