import {PrimaryColumn} from "../../../../../../src/decorator/columns/PrimaryColumn.ts";
import {Entity} from "../../../../../../src/decorator/entity/Entity.ts";
import {Column} from "../../../../../../src/decorator/columns/Column.ts";
import {OneToOne} from "../../../../../../src/decorator/relations/OneToOne.ts";
import {JoinColumn} from "../../../../../../src/decorator/relations/JoinColumn.ts";
import {Category} from "./Category.ts";
import {RelationId} from "../../../../../../src/decorator/relations/RelationId.ts";

@Entity()
export class Post {

    @PrimaryColumn({ type: Number })
    id!: number;

    @Column({ type: String })
    title!: string;

    @OneToOne(type => Category)
    @JoinColumn()
    category!: Category;

    @OneToOne(type => Category)
    @JoinColumn({ referencedColumnName: "name" })
    categoryByName!: Category;

    @OneToOne(type => Category, category => category.post)
    @JoinColumn()
    category2!: Category;

    @RelationId((post: Post) => post.category)
    categoryId!: number;

    @RelationId((post: Post) => post.categoryByName)
    categoryName!: string;

    @RelationId((post: Post) => post.category2)
    category2Id!: number;

}
