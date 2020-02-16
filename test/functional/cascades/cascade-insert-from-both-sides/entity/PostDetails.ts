import {Entity} from "../../../../../src/decorator/entity/Entity.ts";
import {PrimaryColumn} from "../../../../../src/decorator/columns/PrimaryColumn.ts";
import {Post} from "./Post.ts";
import {OneToOne} from "../../../../../src/decorator/relations/OneToOne.ts";

@Entity()
export class PostDetails {

    @PrimaryColumn({ type: String })
    keyword: string;

    @OneToOne(type => Post, post => post.details, {
        cascade: ["insert"]
    })
    post: Post;

}
