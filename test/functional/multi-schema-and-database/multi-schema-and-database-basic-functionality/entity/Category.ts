import {Entity} from "../../../../../src/decorator/entity/Entity.ts";
import {Column} from "../../../../../src/decorator/columns/Column.ts";
import {PrimaryGeneratedColumn} from "../../../../../src/decorator/columns/PrimaryGeneratedColumn.ts";
import {ManyToOne} from "../../../../../src/decorator/relations/ManyToOne.ts";
import {Post} from "./Post.ts";

@Entity({schema: "guest"})
export class Category {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: String })
    name: string;

    @ManyToOne(type => Post)
    post: Post;

}
