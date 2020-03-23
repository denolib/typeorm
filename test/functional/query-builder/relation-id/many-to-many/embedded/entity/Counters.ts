import {Column} from "../../../../../../../src/decorator/columns/Column.ts";
import {ManyToMany} from "../../../../../../../src/decorator/relations/ManyToMany.ts";
import {JoinTable} from "../../../../../../../src/decorator/relations/JoinTable.ts";
import {Category} from "./Category.ts";
import {Subcounters} from "./Subcounters.ts";

export class Counters {

    @Column({ type: Number })
    likes!: number;

    @Column({ type: Number })
    comments!: number;

    @Column({ type: Number })
    favorites!: number;

    @ManyToMany(type => Category, category => category.posts)
    @JoinTable({ name: "counter_categories" })
    categories!: Category[];

    @Column(() => Subcounters, { prefix: "subcnt" })
    subcounters!: Subcounters;

    categoryIds!: number[];

}
