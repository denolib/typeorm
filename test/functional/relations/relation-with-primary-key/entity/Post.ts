import {Entity} from "../../../../../src/decorator/entity/Entity.ts";
import {Column} from "../../../../../src/decorator/columns/Column.ts";
import {ManyToOne} from "../../../../../src/decorator/relations/ManyToOne.ts";
import {Category} from "./Category.ts";

@Entity()
export class Post {

    @ManyToOne(type => Category, category => category.posts, {
        primary!: true,
        cascade!: ["insert"]
    })
    category!: Category;

    @Column({ type: String })
    title!: string;

}
