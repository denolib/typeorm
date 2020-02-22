import {Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn} from "../../../../src/index.ts";
import {Photo} from "./Photo.ts";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: String })
    name: string;

    @ManyToMany(type => Photo)
    @JoinTable()
    photos: Photo[];

}
