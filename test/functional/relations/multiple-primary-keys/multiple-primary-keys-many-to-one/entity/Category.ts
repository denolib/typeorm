import {Entity} from "../../../../../../src/decorator/entity/Entity.ts";
import {PrimaryColumn} from "../../../../../../src/decorator/columns/PrimaryColumn.ts";
import {Column} from "../../../../../../src/decorator/columns/Column.ts";
import {OneToMany} from "../../../../../../src/decorator/relations/OneToMany.ts";
import {Post} from "./Post.ts";
import {Unique} from "../../../../../../src/index.ts";

@Entity()
@Unique(["code", "version", "description"])
export class Category {

    @PrimaryColumn({type: String})
    name!: string;

    @PrimaryColumn({type: String})
    type!: string;

    @Column({type: Number})
    code!: number;

    @Column({type: Number})
    version!: number;

    @Column({nullable: true, type: String})
    description!: string;

    @OneToMany(type => Post, post => post.category)
    posts!: Post[];

    @OneToMany(type => Post, post => post.categoryWithJoinColumn)
    postsWithJoinColumn!: Post[];

    @OneToMany(type => Post, post => post.categoryWithOptions)
    postsWithOptions!: Post[];

    @OneToMany(type => Post, post => post.categoryWithNonPKColumns)
    postsWithNonPKColumns!: Post[];

}
