import {ManyToMany} from "../../../../../../../src/decorator/relations/ManyToMany.ts";
import {Entity} from "../../../../../../../src/decorator/entity/Entity.ts";
import {Column} from "../../../../../../../src/decorator/columns/Column.ts";
import {JoinTable} from "../../../../../../../src/decorator/relations/JoinTable.ts";
import {PrimaryColumn} from "../../../../../../../src/decorator/columns/PrimaryColumn.ts";
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

    @ManyToMany(type => Category, category => category.posts)
    @JoinTable()
    categories!: Category[];

    @ManyToMany(type => Category)
    @JoinTable()
    subcategories!: Category[];

    categoryIds!: number[];

}
