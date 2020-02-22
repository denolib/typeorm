import { Entity, Column, ManyToOne, PrimaryGeneratedColumn } from "../../../../src/index.ts";
import { Person } from "./person.ts";

@Entity()
export class Note {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column({ type: String })
    public label: string;

    @ManyToOne(type => Person, { lazy: true })
    public owner: Promise<Person> | Person;
}
