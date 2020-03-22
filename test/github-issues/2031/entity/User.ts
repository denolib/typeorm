import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "../../../../src/index.ts";
import {Photo} from "./Photo.ts";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: String })
    firstName!: string;

    @Column({ type: String })
    lastName!: string;

    @Column({ type: Number })
    age!: number;

    @OneToMany(type => Photo, photo => photo.user)
    photos!: Photo[];

}
