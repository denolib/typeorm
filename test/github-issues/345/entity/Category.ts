import {Entity} from "../../../../src/decorator/entity/Entity.ts";
import {PrimaryGeneratedColumn} from "../../../../src/decorator/columns/PrimaryGeneratedColumn.ts";
import {Column} from "../../../../src/decorator/columns/Column.ts";
import {Post} from "./Post.ts";
import {ManyToMany} from "../../../../src/decorator/relations/ManyToMany.ts";
import {JoinTable} from "../../../../src/decorator/relations/JoinTable.ts";

@Entity()
export class Category {

    @PrimaryGeneratedColumn()
    category_id!: number;

    @Column({ type: String })
    name!: string;

    @ManyToMany(() => Post, post => post.categories)
    @JoinTable()
    posts!: Post[];

}
