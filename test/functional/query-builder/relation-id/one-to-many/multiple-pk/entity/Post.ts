import {Entity} from "../../../../../../../src/decorator/entity/Entity.ts";
import {Column} from "../../../../../../../src/decorator/columns/Column.ts";
import {PrimaryColumn} from "../../../../../../../src/decorator/columns/PrimaryColumn.ts";
import {Category} from "./Category.ts";
import {OneToMany} from "../../../../../../../src/decorator/relations/OneToMany.ts";

@Entity()
export class Post {

    @PrimaryColumn({ type: Number })
    id: number;

    @PrimaryColumn({ type: Number })
    authorId: number;

    @Column({ type: String })
    title: string;

    @OneToMany(type => Category, category => category.post)
    categories: Category[];

    categoryIds: number[];

}
