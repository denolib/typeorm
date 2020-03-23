import {PrimaryColumn} from "../../../../../../src/decorator/columns/PrimaryColumn.ts";
import {Entity} from "../../../../../../src/decorator/entity/Entity.ts";
import {Column} from "../../../../../../src/decorator/columns/Column.ts";
import {ManyToMany} from "../../../../../../src/decorator/relations/ManyToMany.ts";
import {JoinTable} from "../../../../../../src/decorator/relations/JoinTable.ts";
import {RelationCount} from "../../../../../../src/decorator/relations/RelationCount.ts";
import {Category} from "./Category.ts";

@Entity()
export class Post {

    @PrimaryColumn({ type: Number })
    id!: number;

    @Column({ type: String })
    title!: string;

    @Column({ type: Boolean })
    isRemoved: boolean = false;

    @ManyToMany(type => Category, category => category.posts)
    @JoinTable()
    categories!: Category[];

    @RelationCount((post: Post) => post.categories)
    categoryCount!: number;

    @RelationCount((post: Post) => post.categories, "removedCategories", qb => qb.andWhere("removedCategories.isRemoved = :isRemoved", { isRemoved: true }))
    removedCategoryCount!: number;

}
