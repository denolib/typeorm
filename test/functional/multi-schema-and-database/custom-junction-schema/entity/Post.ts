import {Entity} from "../../../../../src/decorator/entity/Entity.ts";
import {Column} from "../../../../../src/decorator/columns/Column.ts";
import {PrimaryGeneratedColumn} from "../../../../../src/decorator/columns/PrimaryGeneratedColumn.ts";
import {ManyToMany} from "../../../../../src/decorator/relations/ManyToMany.ts";
import {JoinTable} from "../../../../../src/decorator/relations/JoinTable.ts";
import {Category} from "./Category.ts";

@Entity({
    schema!: "yoman"
})
export class Post {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: String })
    name!: string;

    @ManyToMany(type => Category)
    @JoinTable({ schema: "yoman" })
    categories!: Category[];

}
