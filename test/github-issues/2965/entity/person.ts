import { Entity, Column, OneToMany, PrimaryGeneratedColumn } from "../../../../src/index.ts";
import { Note } from "./note.ts";

@Entity()
export class Person {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column({ type: String })
    public name: string;

    @OneToMany(type => Note, note => note.owner, { lazy: true })
    public notes: Promise<Note[]> | Note[];
}
