import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "../../../src/index.ts";
import {Post} from "./Post.ts";

@Entity("sample3_post_information")
export class PostInformation {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: String })
    text: string;

    @OneToMany(type => Post, post => post.information, {
        cascade: ["update"],
    })
    posts: Post[];

}
