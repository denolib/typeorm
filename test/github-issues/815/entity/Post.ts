import {Entity} from "../../../../src/decorator/entity/Entity.ts";
import {PrimaryGeneratedColumn} from "../../../../src/decorator/columns/PrimaryGeneratedColumn.ts";
import {Column} from "../../../../src/decorator/columns/Column.ts";
import {OneToMany} from "../../../../src/decorator/relations/OneToMany.ts";
import {Category} from "./Category.ts";
import {RelationId} from "../../../../src/decorator/relations/RelationId.ts";
import {ManyToMany} from "../../../../src/decorator/relations/ManyToMany.ts";
import {JoinTable} from "../../../../src/decorator/relations/JoinTable.ts";

@Entity()
export class Post {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: String })
    title: string;

    @OneToMany(type => Category, category => category.post)
    categories: Category[];

    @RelationId((post: Post) => post.categories)
    categoryIds: { firstId: number, secondId: number }[];

    @ManyToMany(type => Category, category => category.manyPosts)
    @JoinTable()
    manyCategories: Category[];

    @RelationId((post: Post) => post.manyCategories)
    manyCategoryIds: { firstId: number, secondId: number }[];

}
