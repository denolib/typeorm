import {Entity} from "../../../../src/decorator/entity/Entity.ts";
import {Column} from "../../../../src/decorator/columns/Column.ts";
import {Post} from "./Post.ts";
import {ManyToOne} from "../../../../src/decorator/relations/ManyToOne.ts";
import {Category} from "./Category.ts";

@Entity()
export class PostCategory {

    @ManyToOne(type => Post, post => post.categories, {
        primary!: true,
        cascade!: ["insert"]
    })
    post!: Post;

    @ManyToOne(type => Category, category => category.posts, {
        primary!: true,
        cascade!: ["insert"]
    })
    category!: Category;

    @Column({ type: Boolean })
    addedByAdmin!: boolean;

    @Column({ type: Boolean })
    addedByUser!: boolean;

}
