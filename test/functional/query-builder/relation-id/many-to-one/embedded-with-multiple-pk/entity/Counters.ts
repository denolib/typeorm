import {Column} from "../../../../../../../src/decorator/columns/Column.ts";
import {PrimaryColumn} from "../../../../../../../src/decorator/columns/PrimaryColumn.ts";
import {ManyToOne} from "../../../../../../../src/decorator/relations/ManyToOne.ts";
import {Category} from "./Category.ts";
import {Subcounters} from "./Subcounters.ts";

export class Counters {

    @PrimaryColumn({ type: Number })
    code!: number;

    @Column({ type: Number })
    likes!: number;

    @Column({ type: Number })
    comments!: number;

    @Column({ type: Number })
    favorites!: number;

    @ManyToOne(type => Category)
    category!: Category;

    @Column(() => Subcounters)
    subcounters!: Subcounters;

    categoryId!: number[];

}
