import {Entity, PrimaryColumn} from "../../../../src/index.ts";
import {ManyToMany} from "../../../../src/decorator/relations/ManyToMany.ts";
import {Post} from "./Post.ts";

@Entity()
export class Category {

    @PrimaryColumn({ type: String, collation: "ascii_general_ci", charset: "ascii" })
    id!: string;

    @ManyToMany(type => Post, post => post.categories)
    posts!: Post[];

}
