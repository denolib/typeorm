import {Entity} from "../../../../src/decorator/entity/Entity.ts";
import {PrimaryGeneratedColumn} from "../../../../src/decorator/columns/PrimaryGeneratedColumn.ts";
import {Column} from "../../../../src/decorator/columns/Column.ts";
import {JoinTable} from "../../../../src/decorator/relations/JoinTable.ts";
import {ManyToMany} from "../../../../src/decorator/relations/ManyToMany.ts";
import {Author} from "./Author.ts";

@Entity()
export class Category {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: String })
    name!: string;

    @ManyToMany(type => Author)
    @JoinTable()
    authors!: Author[];

}
