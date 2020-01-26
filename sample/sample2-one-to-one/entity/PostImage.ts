import {Column, Entity, OneToOne, PrimaryGeneratedColumn} from "../../../src/index.ts";
import {Post} from "./Post.ts";

@Entity("sample2_post_image")
export class PostImage {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: String })
    url: string;

    @OneToOne(type => Post, post => post.image)
    post: Post;

}
