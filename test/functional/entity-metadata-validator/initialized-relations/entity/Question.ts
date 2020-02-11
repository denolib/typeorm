import {Entity} from "../../../../../src/decorator/entity/Entity.ts";
import {PrimaryGeneratedColumn} from "../../../../../src/decorator/columns/PrimaryGeneratedColumn.ts";
import {Column} from "../../../../../src/decorator/columns/Column.ts";
import {ManyToMany} from "../../../../../src/decorator/relations/ManyToMany.ts";
import {Category} from "./Category.ts";
import {JoinTable} from "../../../../../src/decorator/relations/JoinTable.ts";

@Entity()
export class Question {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: String })
    title: string;

    @ManyToMany(type => Category, { persistence: false })
    @JoinTable()
    categories: Category[] = [];

}
