import {Entity} from "../../../../src/decorator/entity/Entity.ts";
import {PrimaryGeneratedColumn} from "../../../../src/decorator/columns/PrimaryGeneratedColumn.ts";
import {Column} from "../../../../src/decorator/columns/Column.ts";
import {Post} from "./Post.ts";
import {OneToMany} from "../../../../src/decorator/relations/OneToMany.ts";

@Entity()
export class Category {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: String })
    name!: string;

    @OneToMany(() => Post, post => post.category, { lazy: true })
    posts!: Promise<Post[]>;

}

