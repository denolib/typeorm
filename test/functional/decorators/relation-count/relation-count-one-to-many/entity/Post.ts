import {PrimaryColumn} from "../../../../../../src/decorator/columns/PrimaryColumn.ts";
import {Entity} from "../../../../../../src/decorator/entity/Entity.ts";
import {Column} from "../../../../../../src/decorator/columns/Column.ts";
import {OneToMany} from "../../../../../../src/decorator/relations/OneToMany.ts";
import {RelationCount} from "../../../../../../src/decorator/relations/RelationCount.ts";
import {Category} from "./Category.ts";

@Entity()
export class Post {

    @PrimaryColumn({ type: Number })
    id: number;

    @Column({ type: String })
    title: string;

    @OneToMany(type => Category, category => category.post)
    categories: Category[];

    @RelationCount((post: Post) => post.categories)
    categoryCount: number;

    @RelationCount((post: Post) => post.categories, "rc", qb => qb.andWhere("rc.isRemoved = :isRemoved", { isRemoved: true }))
    removedCategoryCount: number;

}
