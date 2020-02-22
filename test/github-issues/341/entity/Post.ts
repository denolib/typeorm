import {Entity} from "../../../../src/decorator/entity/Entity.ts";
import {PrimaryGeneratedColumn} from "../../../../src/decorator/columns/PrimaryGeneratedColumn.ts";
import {Column} from "../../../../src/decorator/columns/Column.ts";
import {Category} from "./Category.ts";
import {OneToOne} from "../../../../src/decorator/relations/OneToOne.ts";
import {JoinColumn} from "../../../../src/decorator/relations/JoinColumn.ts";

@Entity()
export class Post {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: String })
    title: string;

    @Column({ type: String, nullable: true })
    categoryName: string;

    @OneToOne(type => Category, category => category.post)
    @JoinColumn({ name: "categoryName", referencedColumnName: "name" })
    category: Category;

}
