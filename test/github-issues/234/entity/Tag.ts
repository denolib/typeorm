import {Entity} from "../../../../src/decorator/entity/Entity.ts";
import {PrimaryGeneratedColumn} from "../../../../src/decorator/columns/PrimaryGeneratedColumn.ts";
import {Post} from "./Post.ts";
import {ManyToMany} from "../../../../src/decorator/relations/ManyToMany.ts";
import {Column} from "../../../../src/decorator/columns/Column.ts";

@Entity()
export class Tag {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: String })
    name!: string;

    @ManyToMany(type => Post, post => post.tags, { lazy: true })
    posts!: Promise<Post[]>;

}
