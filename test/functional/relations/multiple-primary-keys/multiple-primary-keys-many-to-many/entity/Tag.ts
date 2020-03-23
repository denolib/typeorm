import {Entity} from "../../../../../../src/decorator/entity/Entity.ts";
import {ManyToMany} from "../../../../../../src/decorator/relations/ManyToMany.ts";
import {JoinTable} from "../../../../../../src/decorator/relations/JoinTable.ts";
import {PrimaryColumn} from "../../../../../../src/decorator/columns/PrimaryColumn.ts";
import {Category} from "./Category.ts";
import {Column} from "../../../../../../src/decorator/columns/Column.ts";

@Entity()
export class Tag {

    @Column({type: Number})
    code!: number;

    @PrimaryColumn({type: String})
    title!: string;

    @PrimaryColumn({type: String})
    description!: string;

    @ManyToMany(type => Category, category => category.tags)
    @JoinTable()
    categories!: Category[];

    @ManyToMany(type => Category, category => category.tagsWithOptions)
    @JoinTable({
        name!: "tag_categories",
        joinColumns: [{
            name!: "tagTitle",
            referencedColumnName!: "title"
        }, {
            name!: "tagDescription",
            referencedColumnName!: "description"
        }],
        inverseJoinColumns!: [{
            name: "categoryName",
            referencedColumnName!: "name"
        }, {
            name!: "categoryType",
            referencedColumnName!: "type"
        }]
    })
    categoriesWithOptions!: Category[];

    @ManyToMany(type => Category, category => category.tagsWithNonPKColumns)
    @JoinTable({
        name!: "tag_categories_non_primary",
        joinColumns: [{
            name!: "tagTitle",
            referencedColumnName!: "title"
        }, {
            name!: "tagDescription",
            referencedColumnName!: "description"
        }],
        inverseJoinColumns!: [{
            name: "categoryCode",
            referencedColumnName!: "code"
        }, {
            name!: "categoryVersion",
            referencedColumnName!: "version"
        }, {
            name!: "categoryDescription",
            referencedColumnName!: "description"
        }]
    })
    categoriesWithNonPKColumns!: Category[];

}
