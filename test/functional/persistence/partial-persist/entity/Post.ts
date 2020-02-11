import {PrimaryColumn} from "../../../../../src/decorator/columns/PrimaryColumn.ts";
import {Category} from "./Category.ts";
import {Entity} from "../../../../../src/decorator/entity/Entity.ts";
import {Column} from "../../../../../src/decorator/columns/Column.ts";
import {ManyToMany} from "../../../../../src/decorator/relations/ManyToMany.ts";
import {JoinTable} from "../../../../../src/decorator/relations/JoinTable.ts";
import {Counters} from "./Counters.ts";

@Entity()
export class Post {

    @PrimaryColumn({ type: Number })
    id: number;

    @Column({ type: String })
    title: string;

    @Column({ type: String })
    description: string;

    @Column(type => Counters)
    counters: Counters;

    @ManyToMany(type => Category, category => category.posts, {
        cascade: ["update"],
    })
    @JoinTable()
    categories: Category[];

}
