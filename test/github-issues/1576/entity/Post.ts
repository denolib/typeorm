import {Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn} from "../../../../src/index.ts";
import {Category} from "./Category.ts";

@Entity()
export class Post {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: String })
    title!: string;

    @Column("text")
    text!: string;

    @ManyToMany(type => Category)
    @JoinTable()
    categories!: Category[];

}
