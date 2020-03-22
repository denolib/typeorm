import {Column, Entity, PrimaryGeneratedColumn} from "../../../../src/index.ts";
import {Category} from "./Category.ts";
import {JoinTable} from "../../../../src/decorator/relations/JoinTable.ts";
import {ManyToMany} from "../../../../src/decorator/relations/ManyToMany.ts";

@Entity()
export class Animal {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: String })
    name!: string;

    @ManyToMany(type => Category)
    @JoinTable()
    categories!: Category[];

}
