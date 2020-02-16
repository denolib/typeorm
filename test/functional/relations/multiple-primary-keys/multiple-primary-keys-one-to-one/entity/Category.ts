import {Entity} from "../../../../../../src/decorator/entity/Entity.ts";
import {PrimaryColumn} from "../../../../../../src/decorator/columns/PrimaryColumn.ts";
import {Column} from "../../../../../../src/decorator/columns/Column.ts";
import {OneToOne} from "../../../../../../src/decorator/relations/OneToOne.ts";
import {Post} from "./Post.ts";
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

    @OneToOne(type => Post, post => post.category)
    post: Post;

    @OneToOne(type => Post, post => post.categoryWithOptions)
    postWithOptions: Post;

    @OneToOne(type => Post, post => post.categoryWithNonPKColumns)
    postWithNonPKColumns: Post;

    @OneToOne(type => Tag, tag => tag.category)
    tag: Tag;

    @OneToOne(type => Tag, tag => tag.categoryWithOptions)
    tagWithOptions: Tag;

    @OneToOne(type => Tag, tag => tag.categoryWithNonPKColumns)
    tagWithNonPKColumns: Tag;

}
