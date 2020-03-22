import {Column, Entity, PrimaryGeneratedColumn} from "../../../../src/index.ts";
import {Category} from "./Category.ts";
import {ManyToMany} from "../../../../src/decorator/relations/ManyToMany.ts";
import {JoinTable} from "../../../../src/decorator/relations/JoinTable.ts";

@Entity()
export class Post {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: String })
    name!: string;

    @Column({ type: Number })
    count!: number;

    @ManyToMany(type => Category)
    @JoinTable()
    categories!: Category[];

}
