import {ManyToMany} from "../../../../../../../src/decorator/relations/ManyToMany.ts";
import {Entity} from "../../../../../../../src/decorator/entity/Entity.ts";
import {PrimaryGeneratedColumn} from "../../../../../../../src/decorator/columns/PrimaryGeneratedColumn.ts";
import {Column} from "../../../../../../../src/decorator/columns/Column.ts";
import {ManyToOne} from "../../../../../../../src/decorator/relations/ManyToOne.ts";
import {JoinTable} from "../../../../../../../src/decorator/relations/JoinTable.ts";
import {Category} from "./Category.ts";
import {Tag} from "./Tag.ts";

@Entity()
export class Post {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: String })
    title!: string;

    @ManyToOne(type => Tag)
    tag!: Tag;

    tagId!: number;

    @ManyToMany(type => Category, category => category.posts)
    @JoinTable()
    categories!: Category[];

    @ManyToMany(type => Category)
    @JoinTable()
    subcategories!: Category[];

    categoryIds!: number[];

}
