import {PrimaryColumn} from "../../../../../../src/decorator/columns/PrimaryColumn.ts";
import {Entity} from "../../../../../../src/decorator/entity/Entity.ts";
import {Column} from "../../../../../../src/decorator/columns/Column.ts";
import {ManyToOne} from "../../../../../../src/decorator/relations/ManyToOne.ts";
import {JoinColumn} from "../../../../../../src/decorator/relations/JoinColumn.ts";
import {RelationId} from "../../../../../../src/decorator/relations/RelationId.ts";
import {Category} from "./Category.ts";

@Entity()
export class Post {

    @PrimaryColumn({ type: Number })
    id: number;

    @Column({ type: String })
    title: string;

    @ManyToOne(type => Category)
    @JoinColumn()
    category: Category;

    @ManyToOne(type => Category)
    @JoinColumn({ referencedColumnName: "name" })
    categoryByName: Category;

    @RelationId((post: Post) => post.category)
    categoryId: number;

    @RelationId((post: Post) => post.categoryByName)
    categoryName: string;

}
