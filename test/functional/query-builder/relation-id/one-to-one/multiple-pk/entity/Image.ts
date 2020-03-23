import {Entity} from "../../../../../../../src/decorator/entity/Entity.ts";
import {PrimaryGeneratedColumn} from "../../../../../../../src/decorator/columns/PrimaryGeneratedColumn.ts";
import {Column} from "../../../../../../../src/decorator/columns/Column.ts";
import {OneToOne} from "../../../../../../../src/decorator/relations/OneToOne.ts";
import {Category} from "./Category.ts";

@Entity()
export class Image {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: String })
    name!: string;

    @OneToOne(type => Category, category => category.image)
    category!: Category;

    categoryId!: number;

}
