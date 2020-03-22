import {Entity} from "../../../../../src/decorator/entity/Entity.ts";
import {PrimaryGeneratedColumn} from "../../../../../src/decorator/columns/PrimaryGeneratedColumn.ts";
import {Column} from "../../../../../src/decorator/columns/Column.ts";
import {Post} from "./Post.ts";
import {OneToOne} from "../../../../../src/decorator/relations/OneToOne.ts";
import {JoinColumn} from "../../../../../src/decorator/relations/JoinColumn.ts";
import {Details} from "./Details.ts";
import {Category} from "./Category.ts";

@Entity()
export class Photo {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: String })
    name!: string;

    @OneToOne(type => Details, details => details.photo)
    details!: Details;

    @OneToOne(type => Post, post => post.photo, {
        nullable!: false
    })
    @JoinColumn()
    post!: Post;

    @OneToOne(type => Category, {
        nullable!: false
    })
    @JoinColumn()
    category!: Category;

}
