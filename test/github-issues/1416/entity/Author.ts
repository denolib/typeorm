import {Column, Entity, PrimaryGeneratedColumn, OneToMany} from "../../../../src/index.ts";
import {Photo} from "./Photo.ts";

@Entity()
export class Author {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: String })
    name!: string;

    @OneToMany(type => Photo, photo => photo.author)
    photos!: Photo[];

}
