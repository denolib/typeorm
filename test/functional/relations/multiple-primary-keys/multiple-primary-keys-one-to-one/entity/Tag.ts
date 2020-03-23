import {Entity} from "../../../../../../src/decorator/entity/Entity.ts";
import {PrimaryColumn} from "../../../../../../src/decorator/columns/PrimaryColumn.ts";
import {Column} from "../../../../../../src/decorator/columns/Column.ts";
import {OneToOne} from "../../../../../../src/decorator/relations/OneToOne.ts";
import {JoinColumn} from "../../../../../../src/decorator/relations/JoinColumn.ts";
import {Category} from "./Category.ts";

@Entity()
export class Tag {

    @Column({type: Number})
    code!: number;

    @PrimaryColumn({type: String})
    title!: string;

    @PrimaryColumn({type: String})
    description!: string;

    @OneToOne(type => Category, category => category.tag)
    @JoinColumn()
    category!: Category;

    @OneToOne(type => Category, category => category.tagWithOptions)
    @JoinColumn([
        { name: "category_name", referencedColumnName!: "name" },
        { name: "category_type", referencedColumnName!: "type" }
    ])
    categoryWithOptions!: Category;

    @OneToOne(type => Category, category => category.tagWithNonPKColumns)
    @JoinColumn([
        { name: "category_code", referencedColumnName!: "code" },
        { name: "category_version", referencedColumnName!: "version" },
        { name: "category_description", referencedColumnName!: "description" }
    ])
    categoryWithNonPKColumns!: Category;

}
