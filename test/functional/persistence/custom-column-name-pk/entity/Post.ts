import {Entity} from "../../../../../src/decorator/entity/Entity.ts";
import {PrimaryColumn} from "../../../../../src/decorator/columns/PrimaryColumn.ts";
import {Column} from "../../../../../src/decorator/columns/Column.ts";
import {ManyToOne} from "../../../../../src/decorator/relations/ManyToOne.ts";
import {Category} from "./Category.ts";
import {Generated} from "../../../../../src/decorator/Generated.ts";

@Entity()
export class Post {

    @PrimaryColumn({name: "theId", type: Number})
    @Generated()
    id: number;

    @Column({type: String})
    title: string;

    @ManyToOne(type => Category, category => category.posts, {
        cascade: ["insert"]
    })
    category: Category;

}
