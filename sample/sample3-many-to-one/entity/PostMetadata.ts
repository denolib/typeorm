import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "../../../src/index.ts";
import {Post} from "./Post.ts";

@Entity("sample3_post_metadata")
export class PostMetadata {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: String })
    description: string;

    @OneToMany(type => Post, post => post.metadata)
    posts: Post[];

}
