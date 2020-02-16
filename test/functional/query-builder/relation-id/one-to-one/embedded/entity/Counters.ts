import {Column} from "../../../../../../../src/decorator/columns/Column.ts";
import {Category} from "./Category.ts";
import {Subcounters} from "./Subcounters.ts";
import {OneToOne} from "../../../../../../../src/decorator/relations/OneToOne.ts";
import {JoinColumn} from "../../../../../../../src/decorator/relations/JoinColumn.ts";

export class Counters {

    @Column({ type: Number })
    likes: number;

    @Column({ type: Number })
    comments: number;

    @Column({ type: Number })
    favorites: number;

    @OneToOne(type => Category, category => category.post)
    @JoinColumn()
    category: Category;

    @Column(() => Subcounters)
    subcounters: Subcounters;

    categoryId: number;

}
