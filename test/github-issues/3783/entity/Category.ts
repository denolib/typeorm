import {PrimaryGeneratedColumn} from "../../../../src/index.ts";
import {Column} from "../../../../src/index.ts";
import {TreeParent} from "../../../../src/index.ts";
import {TreeChildren} from "../../../../src/index.ts";
import {Entity} from "../../../../src/index.ts";
import {Tree} from "../../../../src/index.ts";

@Entity()
@Tree("closure-table")
export class Category {

    @PrimaryGeneratedColumn("uuid")
    id!: number;

    @Column({ type: String })
    name!: string;

    @TreeParent()
    parentCategory!: Category;

    @TreeChildren({ cascade: true })
    childCategories!: Category[];

}
