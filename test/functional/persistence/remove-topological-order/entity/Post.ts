import {Category} from "./Category.ts";
import {Entity} from "../../../../../src/decorator/entity/Entity.ts";
import {PrimaryGeneratedColumn} from "../../../../../src/decorator/columns/PrimaryGeneratedColumn.ts";
import {Column} from "../../../../../src/decorator/columns/Column.ts";
import {OneToMany} from "../../../../../src/decorator/relations/OneToMany.ts";

@Entity()
export class Post {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: String })
    title: string;

    @OneToMany(type => Category, category => category.post, { cascade: ["insert"] })
    categories: Category[];

}
