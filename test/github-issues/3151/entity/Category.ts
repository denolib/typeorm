import {Column} from "../../../../src/index.ts";
import {PrimaryGeneratedColumn} from "../../../../src/index.ts";
import {Entity} from "../../../../src/index.ts";
import {ManyToMany} from "../../../../src/index.ts";
import { Note } from "./Note.ts";

@Entity()
export class Category {

    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: String })
    name!: string;

    @ManyToMany((type) => Note, (note) => note.categories)
    notes!: Note[];
}
