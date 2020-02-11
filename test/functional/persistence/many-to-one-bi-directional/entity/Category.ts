import {PrimaryColumn} from "../../../../../src/decorator/columns/PrimaryColumn.ts";
import {Entity} from "../../../../../src/decorator/entity/Entity.ts";
import {Column} from "../../../../../src/decorator/columns/Column.ts";
import {ManyToOne} from "../../../../../src/decorator/relations/ManyToOne.ts";
import {Post} from "./Post.ts";

@Entity()
export class Category {

    @PrimaryColumn({ type: Number })
    id: number;

    @Column({ type: String })
    name: string;

    @ManyToOne(type => Post, post => post.categories, {
        cascade: true,
        onDelete: "SET NULL"
    })
    post?: Post|null|number;

    constructor(id: number, name: string, post?: Post) {
        this.id = id;
        this.name = name;
        if (post)
            this.post = post;
    }

}
