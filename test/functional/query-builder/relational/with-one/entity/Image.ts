import {Entity} from "../../../../../../src/decorator/entity/Entity.ts";
import {PrimaryGeneratedColumn} from "../../../../../../src/decorator/columns/PrimaryGeneratedColumn.ts";
import {Column} from "../../../../../../src/decorator/columns/Column.ts";
import {OneToOne} from "../../../../../../src/decorator/relations/OneToOne.ts";
import {Post} from "./Post.ts";

@Entity()
export class Image {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: String })
    url: string;

    @OneToOne(type => Post, post => post.image)
    post: Post;

}
