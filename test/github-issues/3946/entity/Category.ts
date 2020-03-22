import {Entity} from "../../../../src/decorator/entity/Entity.ts";
import {PrimaryGeneratedColumn} from "../../../../src/decorator/columns/PrimaryGeneratedColumn.ts";
import {Column} from "../../../../src/decorator/columns/Column.ts";
import {ManyToMany} from "../../../../src/decorator/relations/ManyToMany.ts";
import {Post} from "./Post.ts";
import {Image} from "./Image.ts";
import {JoinTable} from "../../../../src/decorator/relations/JoinTable.ts";

@Entity()
export class Category {

    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: String })
    name!: string;

    @Column({ type: Boolean })
    isRemoved: boolean = false;

    @ManyToMany(type => Post, post => post.categories)
    posts!: Post[];

    @ManyToMany(type => Image, image => image.categories)
    @JoinTable()
    images!: Image[];

    postCount!: number;

    removedPostCount!: number;

    imageCount!: number;

    removedImageCount!: number;

}
