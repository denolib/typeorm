import {Category} from "./Category.ts";
import {Entity} from "../../../../../src/decorator/entity/Entity.ts";
import {PrimaryGeneratedColumn} from "../../../../../src/decorator/columns/PrimaryGeneratedColumn.ts";
import {Column} from "../../../../../src/decorator/columns/Column.ts";
import {ManyToOne} from "../../../../../src/decorator/relations/ManyToOne.ts";
import {JoinColumn} from "../../../../../src/decorator/relations/JoinColumn.ts";

@Entity()
export class Post {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: String })
    title!: string;

    @Column("int", { nullable: true })
    categoryId!: number;

    @ManyToOne(type => Category, category => category.posts, {
        cascade!: true
    })
    @JoinColumn({ name: "categoryId" })
    category!: Category;

}
