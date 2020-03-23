import {OneToOne} from "../../../../../src/decorator/relations/OneToOne.ts";
import {Entity} from "../../../../../src/decorator/entity/Entity.ts";
import {PrimaryGeneratedColumn} from "../../../../../src/decorator/columns/PrimaryGeneratedColumn.ts";
import {Column} from "../../../../../src/decorator/columns/Column.ts";
import {RelationCount} from "../../../../../src/decorator/relations/RelationCount.ts";
import {ManyToMany} from "../../../../../src/decorator/relations/ManyToMany.ts";
import {Category} from "./Category.ts";

@Entity()
export class Post {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: String })
    title!: string;

    @OneToOne(type => Category)
    category!: Category;

    @ManyToMany(type => Category)
    category2!: Category;

    @RelationCount((post: Post) => post.category)
    categoryCount!: number;

    @RelationCount((post: Post) => post.category2)
    categoryCount2!: number;

}
