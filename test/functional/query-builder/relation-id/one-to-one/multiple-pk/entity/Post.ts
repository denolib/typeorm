import {Entity} from "../../../../../../../src/decorator/entity/Entity.ts";
import {Column} from "../../../../../../../src/decorator/columns/Column.ts";
import {PrimaryColumn} from "../../../../../../../src/decorator/columns/PrimaryColumn.ts";
import {OneToOne} from "../../../../../../../src/decorator/relations/OneToOne.ts";
import {JoinColumn} from "../../../../../../../src/decorator/relations/JoinColumn.ts";
import {Category} from "./Category.ts";

@Entity()
export class Post {

    @PrimaryColumn({ type: Number })
    id!: number;

    @PrimaryColumn({ type: Number })
    authorId!: number;

    @Column({ type: String })
    title!: string;

    @Column({ type: Boolean })
    isRemoved: boolean = false;

    @OneToOne(type => Category, category => category.post)
    @JoinColumn()
    category!: Category;

    @OneToOne(type => Category)
    @JoinColumn()
    subcategory!: Category;

    categoryId!: number;

}
