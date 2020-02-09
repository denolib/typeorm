import {PrimaryColumn} from "../../../../../../src/decorator/columns/PrimaryColumn.ts";
import {ManyToMany} from "../../../../../../src/decorator/relations/ManyToMany.ts";
import {Entity} from "../../../../../../src/decorator/entity/Entity.ts";
import {Column} from "../../../../../../src/decorator/columns/Column.ts";
import {JoinTable} from "../../../../../../src/decorator/relations/JoinTable.ts";
import {RelationId} from "../../../../../../src/decorator/relations/RelationId.ts";
import {Category} from "./Category.ts";

@Entity()
export class Post {

    @PrimaryColumn({ type: Number })
    id: number;

    @Column({ type: String })
    title: string;

    @Column({ type: Boolean })
    isRemoved: boolean = false;

    @ManyToMany(type => Category, category => category.posts)
    @JoinTable()
    categories: Category[];

    @ManyToMany(type => Category)
    @JoinTable()
    subcategories: Category[];

    @RelationId((post: Post) => post.categories)
    categoryIds: number[];

    @RelationId((post: Post) => post.categories, "rc", qb => qb.andWhere("rc.isRemoved = :isRemoved", { isRemoved: true }))
    removedCategoryIds: number[];

    @RelationId((post: Post) => post.subcategories)
    subcategoryIds: number[];

    @RelationId((post: Post) => post.subcategories, "rsc", qb => qb.andWhere("rsc.isRemoved = :isRemoved", { isRemoved: true }))
    removedSubcategoryIds: number[];

}
