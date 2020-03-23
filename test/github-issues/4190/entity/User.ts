import {Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne, JoinColumn} from "../../../../src/index.ts";
import {Photo} from "./Photo.ts";
import {Profile} from "./Profile.ts";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: String })
    name!: string;

    @OneToMany("Photo", "user")
    photos!: Photo[];

    @OneToOne("Profile")
    @JoinColumn()
    profile!: Profile;

}
