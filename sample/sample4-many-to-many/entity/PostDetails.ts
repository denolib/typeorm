import {Column, Entity, ManyToMany, PrimaryGeneratedColumn} from "../../../src/index.ts";
import {Post} from "./Post.ts";

@Entity("sample4_post_details")
export class PostDetails {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: String,
        nullable: true
    })
    authorName: string|null;

    @Column({
        type: String,
        nullable: true
    })
    comment: string|null;

    @Column({
        type: String,
        nullable: true
    })
    metadata: string|null;

    @ManyToMany(type => Post, post => post.details, {
        cascade: true
    })
    posts: Post[];

}
