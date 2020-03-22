import {Entity} from "../../../../src/decorator/entity/Entity.ts";
import {PrimaryGeneratedColumn} from "../../../../src/decorator/columns/PrimaryGeneratedColumn.ts";
import {Column} from "../../../../src/decorator/columns/Column.ts";
import {JoinTable} from "../../../../src/decorator/relations/JoinTable.ts";
import {ManyToMany} from "../../../../src/decorator/relations/ManyToMany.ts";
import {Category} from "./Category.ts";

@Entity()
export class Post {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: String })
    title!: string;

    @ManyToMany(type => Category)
    @JoinTable()
    categories!: Category[];

}
