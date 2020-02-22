import {Entity} from "../../../../src/decorator/entity/Entity.ts";
import {PrimaryGeneratedColumn} from "../../../../src/decorator/columns/PrimaryGeneratedColumn.ts";
import {Column} from "../../../../src/decorator/columns/Column.ts";
import {Post} from "./Post.ts";
import {ManyToMany} from "../../../../src/decorator/relations/ManyToMany.ts";

@Entity()
export class Category {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: String })
    title: string;

    @ManyToMany(type => Post, post => post.categories)
    posts: Post[];

}
