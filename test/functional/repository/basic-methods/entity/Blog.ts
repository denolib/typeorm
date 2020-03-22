import {Entity} from "../../../../../src/decorator/entity/Entity.ts";
import {PrimaryGeneratedColumn} from "../../../../../src/decorator/columns/PrimaryGeneratedColumn.ts";
import {Column} from "../../../../../src/decorator/columns/Column.ts";
import {Category} from "./Category.ts";
import {ManyToMany} from "../../../../../src/decorator/relations/ManyToMany.ts";
import {JoinTable} from "../../../../../src/decorator/relations/JoinTable.ts";

@Entity()
export class Blog {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: String })
    title!: string;

    @Column({ type: String })
    text!: string;

    @ManyToMany(type => Category)
    @JoinTable()
    categories!: Category[];

    @Column({ type: Number })
    counter: number = 0;

}
