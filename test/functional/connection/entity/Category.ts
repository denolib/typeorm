import {PrimaryGeneratedColumn} from "../../../../src/decorator/columns/PrimaryGeneratedColumn.ts";
import {Column} from "../../../../src/decorator/columns/Column.ts";
import {TreeParent} from "../../../../src/decorator/tree/TreeParent.ts";
import {TreeChildren} from "../../../../src/decorator/tree/TreeChildren.ts";
import {TreeLevelColumn} from "../../../../src/decorator/tree/TreeLevelColumn.ts";
import {Entity} from "../../../../src/decorator/entity/Entity.ts";
import {Tree} from "../../../../src/decorator/tree/Tree.ts";

@Entity("CaTeGoRy")
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

    @TreeLevelColumn()
    level!: number;

}
