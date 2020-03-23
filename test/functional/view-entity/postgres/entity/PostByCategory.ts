import {Connection} from "../../../../../src/index.ts";
import {ViewColumn} from "../../../../../src/decorator/columns/ViewColumn.ts";
import {ViewEntity} from "../../../../../src/decorator/entity-view/ViewEntity.ts";
import {Category} from "./Category.ts";
import {Post} from "./Post.ts";

@ViewEntity({
    materialized!: true,
    expression: (connection: Connection) => connection.createQueryBuilder()
        .select("category.name", "categoryName")
        .addSelect("COUNT(post.id)", "postCount")
        .from(Post, "post")
        .innerJoin(Category, "category", "category.id = post.categoryId")
        .groupBy("category.name")
})
export class PostByCategory {

    @ViewColumn()
    categoryName!: string;

    @ViewColumn()
    postCount!: number;

}
