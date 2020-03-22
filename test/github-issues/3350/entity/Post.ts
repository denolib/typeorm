import {Column} from "../../../../src/decorator/columns/Column.ts";
import {PrimaryGeneratedColumn} from "../../../../src/decorator/columns/PrimaryGeneratedColumn.ts";
import {Entity} from "../../../../src/decorator/entity/Entity.ts";
import {JoinColumn} from "../../../../src/decorator/relations/JoinColumn.ts";
import {ManyToOne} from "../../../../src/decorator/relations/ManyToOne.ts";
import {Category} from "./Category.ts";

@Entity()
export class Post {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: Number, name: "category_id" })
    categoryId!: number;

    @ManyToOne(() => Category)
    @JoinColumn({ name: "category_id" })
    category!: Category;

}
