import {Column, Entity, OneToOne, PrimaryGeneratedColumn} from "../../../src/index.ts";
import {Post} from "./Post.ts";

@Entity("sample2_post_details")
export class PostDetails {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: String })
    authorName: string;

    @Column({ type: String })
    comment: string;

    @Column({ type: String })
    metadata: string;

    @OneToOne(type => Post, post => post.details, {
        cascade: true
    })
    post: Post;

}
