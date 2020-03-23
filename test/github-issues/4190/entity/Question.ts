import {Entity, PrimaryGeneratedColumn, ManyToMany, JoinTable} from "../../../../src/index.ts";
import {Column} from "../../../../src/decorator/columns/Column.ts";
import {Category} from "./Category.ts";

@Entity()
export class Question {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: String })
    name!: string;

    @ManyToMany("Category")
    @JoinTable()
    categories!: Category[];

}
