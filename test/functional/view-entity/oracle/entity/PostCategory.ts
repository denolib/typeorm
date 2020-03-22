import {ViewColumn} from "../../../../../src/decorator/columns/ViewColumn.ts";
import {ViewEntity} from "../../../../../src/decorator/entity-view/ViewEntity.ts";

@ViewEntity({ expression!: `
    SELECT "post"."id" "id", "post"."name" AS "name", "category"."name" AS "categoryName"
    FROM "post" "post"
    LEFT JOIN "category" "category" ON "post"."categoryId" = "category"."id"
`})
export class PostCategory {

    @ViewColumn()
    id!: number;

    @ViewColumn()
    name!: string;

    @ViewColumn()
    categoryName!: string;

}
