import {Column, Entity, PrimaryGeneratedColumn} from "../../../../src/index.ts";
import {Category} from "./Category.ts";
import {ManyToOne} from "../../../../src/decorator/relations/ManyToOne.ts";

@Entity()
export class Animal {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: String })
    name!: string;

    @ManyToOne(() => Category)
    category!: Category;

}
