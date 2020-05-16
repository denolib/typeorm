import {Entity} from "../../../../src/decorator/entity/Entity.ts";
import {Column} from "../../../../src/decorator/columns/Column.ts";
import {PrimaryGeneratedColumn} from "../../../../src/decorator/columns/PrimaryGeneratedColumn.ts";
import {OneToMany} from "../../../../src/decorator/relations/OneToMany.ts";
import {Category} from "./Category.ts";

@Entity()
export class Post {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: String })
    title!: string;

    @OneToMany(type => Category, category => category.post, { lazy: true })
    categories!: Promise<Category[]>;

}
