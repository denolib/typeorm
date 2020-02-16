import {OneToOne} from "../../../../../src/decorator/relations/OneToOne.ts";
import {Entity} from "../../../../../src/decorator/entity/Entity.ts";
import {PrimaryGeneratedColumn} from "../../../../../src/decorator/columns/PrimaryGeneratedColumn.ts";
import {Column} from "../../../../../src/decorator/columns/Column.ts";
import {ManyToMany} from "../../../../../src/decorator/relations/ManyToMany.ts";
import {Category} from "./Category.ts";
import {JoinTable} from "../../../../../src/decorator/relations/JoinTable.ts";
import {JoinColumn} from "../../../../../src/decorator/relations/JoinColumn.ts";

@Entity()
export class Post {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: String })
    title: string;

    @OneToOne(type => Category)
    @JoinColumn()
    category: Category;

    @ManyToMany(type => Category)
    @JoinTable()
    categories: Category[] = [];

}
