import {PrimaryColumn} from "../../../../../src/decorator/columns/PrimaryColumn.ts";
import {Entity} from "../../../../../src/decorator/entity/Entity.ts";
import {Post} from "./Post.ts";
import {Column} from "../../../../../src/decorator/columns/Column.ts";
import {ManyToMany} from "../../../../../src/decorator/relations/ManyToMany.ts";

@Entity()
export class Category {

    @PrimaryColumn({ type: Number })
    id!: number;

    @Column({ type: String })
    name!: string;

    @Column({ type: Number })
    position!: number;

    @ManyToMany(type => Post, post => post.categories)
    posts!: Post[];

}
