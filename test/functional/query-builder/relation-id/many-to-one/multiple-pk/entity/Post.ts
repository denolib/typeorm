import {Entity} from "../../../../../../../src/decorator/entity/Entity.ts";
import {Column} from "../../../../../../../src/decorator/columns/Column.ts";
import {PrimaryColumn} from "../../../../../../../src/decorator/columns/PrimaryColumn.ts";
import {Category} from "./Category.ts";
import {ManyToOne} from "../../../../../../../src/decorator/relations/ManyToOne.ts";

@Entity()
export class Post {

    @PrimaryColumn({ type: Number })
    id: number;

    @PrimaryColumn({ type: Number })
    authorId: number;

    @Column({ type: String })
    title: string;

    @Column({ type: Boolean })
    isRemoved: boolean = false;

    @ManyToOne(type => Category, category => category.posts)
    category: Category;

    @ManyToOne(type => Category)
    subcategory: Category;

    categoryId: number;

}
