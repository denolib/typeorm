import {Column, Entity, OneToOne, PrimaryGeneratedColumn} from "../../../src/index.ts";
import {Post} from "./Post.ts";

@Entity("sample2_post_metadata")
export class PostMetadata {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: String })
    description: string;

    @OneToOne(type => Post, post => post.metadata)
    post: Post;

}
