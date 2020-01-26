import {Column, Entity, OneToOne, PrimaryGeneratedColumn} from "../../../src/index.ts";
import {Post} from "./Post.ts";

@Entity("sample2_post_information")
export class PostInformation {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: String })
    text: string;

    @OneToOne(type => Post, post => post.information, {
        cascade: ["update"]
    })
    post: Post;

}
