import {Column, Entity, ManyToMany, PrimaryGeneratedColumn} from "../../../src/index.ts";
import {Post} from "./Post.ts";

@Entity("sample4_post_image")
export class PostImage {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: String })
    url: string;

    @ManyToMany(type => Post, post => post.images)
    posts: Post[];

}
