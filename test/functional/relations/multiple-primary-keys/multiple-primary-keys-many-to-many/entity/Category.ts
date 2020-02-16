import {Entity} from "../../../../../../src/decorator/entity/Entity.ts";
import {PrimaryColumn} from "../../../../../../src/decorator/columns/PrimaryColumn.ts";
import {Column} from "../../../../../../src/decorator/columns/Column.ts";
import {Post} from "./Post.ts";
import {ManyToMany} from "../../../../../../src/decorator/relations/ManyToMany.ts";
import {Tag} from "./Tag.ts";
import {Unique} from "../../../../../../src/index.ts";

@Entity()
@Unique(["code", "version", "description"])
export class Category {

    @PrimaryColumn({type: String})
    name: string;

    @PrimaryColumn({type: String})
    type: string;

    @Column({type: Number})
    code: number;

    @Column({type: Number})
    version: number;

    @Column({nullable: true, type: String})
    description: string;

    @ManyToMany(type => Post, post => post.categories)
    posts: Post[];

    @ManyToMany(type => Post, post => post.categoriesWithOptions)
    postsWithOptions: Post[];

    @ManyToMany(type => Post, post => post.categoriesWithNonPKColumns)
    postsWithNonPKColumns: Post[];

    @ManyToMany(type => Tag, tag => tag.categories)
    tags: Tag[];

    @ManyToMany(type => Tag, tag => tag.categoriesWithOptions)
    tagsWithOptions: Tag[];

    @ManyToMany(type => Tag, tag => tag.categoriesWithNonPKColumns)
    tagsWithNonPKColumns: Tag[];

}
