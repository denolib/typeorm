import {Entity} from "../../../../../../src/decorator/entity/Entity.ts";
import {PrimaryGeneratedColumn} from "../../../../../../src/decorator/columns/PrimaryGeneratedColumn.ts";
import {Column} from "../../../../../../src/decorator/columns/Column.ts";
import {ManyToOne} from "../../../../../../src/decorator/relations/ManyToOne.ts";
import {OneToMany} from "../../../../../../src/decorator/relations/OneToMany.ts";
import {Post} from "./Post.ts";
import {Image} from "./Image.ts";

@Entity()
export class Category {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: String })
    name: string;

    @Column({ type: Boolean })
    isRemoved: boolean = false;

    @ManyToOne(type => Post, post => post.categories)
    post: Post;

    @OneToMany(type => Image, image => image.category)
    images: Image[];

    imageCount: number;

}
