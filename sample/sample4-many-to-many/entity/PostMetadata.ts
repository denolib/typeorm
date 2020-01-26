import {Column, Entity, ManyToMany, PrimaryGeneratedColumn} from "../../../src/index.ts";
import {Post} from "./Post.ts";

@Entity("sample4_post_metadata")
export class PostMetadata {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: String })
    description: string;

    @ManyToMany(type => Post, post => post.metadatas)
    posts: Post[];

}
