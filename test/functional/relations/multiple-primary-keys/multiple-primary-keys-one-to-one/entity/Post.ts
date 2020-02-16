import {Entity} from "../../../../../../src/decorator/entity/Entity.ts";
import {Column} from "../../../../../../src/decorator/columns/Column.ts";
import {PrimaryGeneratedColumn} from "../../../../../../src/decorator/columns/PrimaryGeneratedColumn.ts";
import {JoinColumn} from "../../../../../../src/decorator/relations/JoinColumn.ts";
import {OneToOne} from "../../../../../../src/decorator/relations/OneToOne.ts";
import {Category} from "./Category.ts";

@Entity()
export class Post {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: String})
    title: string;

    @OneToOne(type => Category, category => category.post)
    @JoinColumn()
    category: Category;

    @OneToOne(type => Category, category => category.postWithOptions)
    @JoinColumn([
        { name: "category_name", referencedColumnName: "name" },
        { name: "category_type", referencedColumnName: "type" }
    ])
    categoryWithOptions: Category;

    @OneToOne(type => Category, category => category.postWithNonPKColumns)
    @JoinColumn([
        { name: "category_code", referencedColumnName: "code" },
        { name: "category_version", referencedColumnName: "version" },
        { name: "category_description", referencedColumnName: "description" }
    ])
    categoryWithNonPKColumns: Category;

}
