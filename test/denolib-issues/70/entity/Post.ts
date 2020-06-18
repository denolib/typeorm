import {Entity} from "../../../../src/decorator/entity/Entity.ts";
import {PrimaryGeneratedColumn} from "../../../../src/decorator/columns/PrimaryGeneratedColumn.ts";
import {Column} from "../../../../src/decorator/columns/Column.ts";
import {Category} from "./Category.ts";
import {ManyToOne} from "../../../../src/decorator/relations/ManyToOne.ts";

@Entity()
export class Post {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: String })
    title!: string;

    @ManyToOne(() => Category, category => category.posts, {
        cascade: ["insert"],
        lazy: true
    })
    category!: Promise<Category>;

}

