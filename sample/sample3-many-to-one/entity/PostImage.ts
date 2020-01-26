import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "../../../src/index.ts";
import {Post} from "./Post.ts";

@Entity("sample3_post_image")
export class PostImage {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: String })
    url: string;

    @OneToMany(type => Post, post => post.image)
    posts: Post[];

}
