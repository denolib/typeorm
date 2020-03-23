import {Entity} from "../../../../../src/decorator/entity/Entity.ts";
import {PrimaryGeneratedColumn} from "../../../../../src/decorator/columns/PrimaryGeneratedColumn.ts";
import {Column} from "../../../../../src/decorator/columns/Column.ts";
import {OneToOne} from "../../../../../src/decorator/relations/OneToOne.ts";
import {Category} from "./Category.ts";

@Entity()
export class CategoryMetadata {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: String })
    keyword!: string;

    @OneToOne(type => Category, category => category.metadata)
    category!: Category;

}
