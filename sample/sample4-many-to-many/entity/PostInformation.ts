import {Column, Entity, ManyToMany, PrimaryGeneratedColumn} from "../../../src/index.ts";
import {Post} from "./Post.ts";

@Entity("sample4_post_information")
export class PostInformation {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: String })
    text: string;

    @ManyToMany(type => Post, post => post.informations, {
        cascade: ["update"],
    })
    posts: Post[];

}
