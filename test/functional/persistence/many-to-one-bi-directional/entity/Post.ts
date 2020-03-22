import {PrimaryColumn} from "../../../../../src/decorator/columns/PrimaryColumn.ts";
import {Entity} from "../../../../../src/decorator/entity/Entity.ts";
import {Column} from "../../../../../src/decorator/columns/Column.ts";
import {Category} from "./Category.ts";
import {OneToMany} from "../../../../../src/decorator/relations/OneToMany.ts";

@Entity()
export class Post {

    @PrimaryColumn({ type: Number })
    id!: number;

    @Column({ type: String })
    title!: string;

    @OneToMany(type => Category, category => category.post)
    categories!: Category[];

    constructor(id: number, title: string) {
        this.id = id;
        this.title = title;
    }

}
