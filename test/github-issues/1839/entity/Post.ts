import {Entity, ManyToMany, PrimaryColumn} from "../../../../src/index.ts";
import {JoinTable} from "../../../../src/decorator/relations/JoinTable.ts";
import {Category} from "./Category.ts";

@Entity()
export class Post {

    @PrimaryColumn({ type: String, collation: "utf8_unicode_ci", charset: "utf8" })
    id!: string;

    @ManyToMany(type => Category, category => category.posts)
    @JoinTable()
    categories!: Category[];

}
