import {Entity} from "../../../../../../../src/decorator/entity/Entity.ts";
import {ManyToOne} from "../../../../../../../src/decorator/relations/ManyToOne.ts";
import {Post} from "./Post.ts";
import {Category} from "./Category.ts";
import {Image} from "./Image.ts";

@Entity()
export class PostCategory {

    @ManyToOne(type => Post, post => post.categories, {
        primary: true
    })
    post: Post;

    @ManyToOne(type => Category, category => category.posts, {
        primary: true
    })
    category: Category;

    @ManyToOne(type => Image)
    image: Image;

    postId: number;

    categoryId: number;

    imageId: number;

}
