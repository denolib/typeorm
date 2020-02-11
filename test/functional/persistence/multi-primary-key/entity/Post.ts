import {Entity} from "../../../../../src/decorator/entity/Entity.ts";
import {PrimaryColumn} from "../../../../../src/decorator/columns/PrimaryColumn.ts";
import {Column} from "../../../../../src/decorator/columns/Column.ts";
import {ManyToOne} from "../../../../../src/decorator/relations/ManyToOne.ts";
import {Category} from "./Category.ts";

@Entity()
export class Post {

    @PrimaryColumn({ type: Number })
    firstId: number;

    @PrimaryColumn({ type: Number })
    secondId: number;

    @Column({ type: String })
    title: string;

    @ManyToOne(type => Category, category => category.posts)
    category: Category;

}
