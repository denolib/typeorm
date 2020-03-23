import {Category} from "./Category.ts";
import {Entity} from "../../../../../src/decorator/entity/Entity.ts";
import {PrimaryGeneratedColumn} from "../../../../../src/decorator/columns/PrimaryGeneratedColumn.ts";
import {OneToMany} from "../../../../../src/decorator/relations/OneToMany.ts";
import {Column} from "../../../../../src/decorator/columns/Column.ts";

@Entity()
export class Post {

    @PrimaryGeneratedColumn()
    id!: number;

    @OneToMany(type => Category, category => category.post)
    categories!: Category[]|null;

    @Column({
        type!: String,
        default!: "supervalue"
    })
    title!: string;

}
