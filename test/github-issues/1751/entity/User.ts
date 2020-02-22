import {Column, Entity, PrimaryGeneratedColumn} from "../../../../src/index.ts";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id = undefined;

    @Column("varchar")
    email = "";

    @Column("varchar")
    avatarURL = "";
}
