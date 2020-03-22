import {Entity, PrimaryGeneratedColumn} from "../../../../src/index.ts";
import {Tree} from "../../../../src/decorator/tree/Tree.ts";
import {TreeParent} from "../../../../src/decorator/tree/TreeParent.ts";
import {TreeChildren} from "../../../../src/decorator/tree/TreeChildren.ts";
import {Column} from "../../../../src/decorator/columns/Column.ts";

@Entity()
@Tree("closure-table")
export class Category {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: String })
    name!: string;

    @TreeParent()
    parentCategory!: Category;

    @TreeChildren({ cascade: true })
    childCategories!: Category[];

}
