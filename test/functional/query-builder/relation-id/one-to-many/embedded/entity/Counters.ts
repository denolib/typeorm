import {Column} from "../../../../../../../src/decorator/columns/Column.ts";
import {Category} from "./Category.ts";
import {Subcounters} from "./Subcounters.ts";
import {OneToMany} from "../../../../../../../src/decorator/relations/OneToMany.ts";

export class Counters {

    @Column({ type: Number })
    likes!: number;

    @Column({ type: Number })
    comments!: number;

    @Column({ type: Number })
    favorites!: number;

    @OneToMany(type => Category, category => category.posts)
    categories!: Category[];

    @Column(() => Subcounters)
    subcounters!: Subcounters;

    categoryIds!: number[];

}
