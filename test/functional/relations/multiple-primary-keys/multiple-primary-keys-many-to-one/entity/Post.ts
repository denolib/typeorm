import {Entity} from "../../../../../../src/decorator/entity/Entity.ts";
import {Column} from "../../../../../../src/decorator/columns/Column.ts";
import {PrimaryGeneratedColumn} from "../../../../../../src/decorator/columns/PrimaryGeneratedColumn.ts";
import {ManyToOne} from "../../../../../../src/decorator/relations/ManyToOne.ts";
import {JoinColumn} from "../../../../../../src/decorator/relations/JoinColumn.ts";
import {Category} from "./Category.ts";

@Entity()
export class Post {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: String})
    title: string;

    @ManyToOne(type => Category)
    category: Category;

    @ManyToOne(type => Category)
    @JoinColumn()
    categoryWithJoinColumn: Category;

    @ManyToOne(type => Category)
    @JoinColumn([
        { name: "category_name", referencedColumnName: "name" },
        { name: "category_type", referencedColumnName: "type" }
    ])
    categoryWithOptions: Category;

    @ManyToOne(type => Category)
    @JoinColumn([
        { name: "category_code", referencedColumnName: "code" },
        { name: "category_version", referencedColumnName: "version" },
        { name: "category_description", referencedColumnName: "description" }
    ])
    categoryWithNonPKColumns: Category;

}
