import {Connection} from "../../../../../src/index.ts";
import {ViewColumn} from "../../../../../src/decorator/columns/ViewColumn.ts";
import {ViewEntity} from "../../../../../src/decorator/entity-view/ViewEntity.ts";
import {Album} from "./Album.ts";
import {Category} from "./Category.ts";
import {Photo} from "./Photo.ts";

@ViewEntity({
    expression: (connection: Connection) => connection.createQueryBuilder()
        .select("photo.id", "id")
        .addSelect("photo.name", "name")
        .addSelect("category.name", "categoryName")
        .addSelect("album.name", "albumName")
        .from(Photo, "photo")
        .leftJoin(Album, "album", "album.id = photo.albumId")
        .leftJoin(Category, "category", "category.id = album.categoryId")
        .where(`category.name = 'Cars'`)
})
export class PhotoAlbumCategory {

    @ViewColumn()
    id!: number;

    @ViewColumn()
    name!: string;

    @ViewColumn()
    categoryName!: string;

    @ViewColumn()
    albumName!: string;
}
