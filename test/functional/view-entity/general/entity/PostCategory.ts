import {Connection} from "../../../../../src/index.ts";
import {ViewColumn} from "../../../../../src/decorator/columns/ViewColumn.ts";
import {ViewEntity} from "../../../../../src/decorator/entity-view/ViewEntity.ts";
import {Category} from "./Category.ts";
import {Post} from "./Post.ts";

@ViewEntity({
    expression: (connection: Connection) => connection.createQueryBuilder()
        .select("post.id", "id")
        .addSelect("post.name", "name")
        .addSelect("category.name", "categoryName")
        .from(Post, "post")
        .leftJoin(Category, "category", "category.id = post.categoryId")
})
export class PostCategory {

    @ViewColumn()
    id!: number;

    @ViewColumn()
    name!: string;

    @ViewColumn()
    categoryName!: string;

}
