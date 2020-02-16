import {Entity} from "../../../../../../../src/decorator/entity/Entity.ts";
import {Column} from "../../../../../../../src/decorator/columns/Column.ts";
import {ManyToMany} from "../../../../../../../src/decorator/relations/ManyToMany.ts";
import {PrimaryColumn} from "../../../../../../../src/decorator/columns/PrimaryColumn.ts";
import {JoinTable} from "../../../../../../../src/decorator/relations/JoinTable.ts";
import {Post} from "./Post.ts";
import {Image} from "./Image.ts";

@Entity()
export class Category {

    @PrimaryColumn({ type: Number })
    id: number;

    @PrimaryColumn({ type: Number })
    code: number;

    @Column({ type: String })
    name: string;

    @Column({ type: Boolean })
    isRemoved: boolean = false;

    @ManyToMany(type => Post, post => post.categories)
    posts: Post[];

    @ManyToMany(type => Image, image => image.categories)
    @JoinTable()
    images: Image[];

    postIds: number[];

    imageIds: number[];

}
