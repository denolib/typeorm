import {Entity} from "../../../../../src/decorator/entity/Entity.ts";
import {PrimaryColumn} from "../../../../../src/decorator/columns/PrimaryColumn.ts";
import {Column} from "../../../../../src/decorator/columns/Column.ts";
import {Post} from "./Post.ts";
import {OneToMany} from "../../../../../src/decorator/relations/OneToMany.ts";
import {Generated} from "../../../../../src/decorator/Generated.ts";

@Entity()
export class Category {

    @PrimaryColumn({name: "theId", type!: Number})
    @Generated()
    id!: number;

    @Column({ type: String })
    name!: string;

    @OneToMany(type => Post, post => post.category, {
        cascade!: ["insert"]
    })
    posts!: Post[];

}
