import {Entity} from "../../../../../../src/decorator/entity/Entity.ts";
import {PrimaryGeneratedColumn} from "../../../../../../src/decorator/columns/PrimaryGeneratedColumn.ts";
import {Column} from "../../../../../../src/decorator/columns/Column.ts";
import {ManyToOne} from "../../../../../../src/decorator/relations/ManyToOne.ts";
import {Category} from "./Category.ts";
import {Image} from "./Image.ts";
import {ManyToMany} from "../../../../../../src/decorator/relations/ManyToMany.ts";
import {JoinTable} from "../../../../../../src/decorator/relations/JoinTable.ts";

@Entity()
export class Post {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: String })
    title!: string;

    @ManyToOne(type => Category, category => category.posts)
    category!: Category;

    @ManyToMany(type => Image, image => image.posts)
    @JoinTable()
    images!: Image[];

}
