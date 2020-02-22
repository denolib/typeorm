import {Column} from "../../../../src/index.ts";
import {PrimaryGeneratedColumn} from "../../../../src/index.ts";
import {Entity} from "../../../../src/index.ts";
import {JoinTable} from "../../../../src/index.ts";
import {ManyToMany} from "../../../../src/index.ts";
import { Category } from "./Category.ts";

@Entity()
export class Note {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: String })
    content: string;

    @ManyToMany((type) => Category, (category) => category.notes)
    @JoinTable()
    categories: Category[];
}
