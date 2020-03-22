import {Column, Entity, PrimaryGeneratedColumn} from "../../../../src/index.ts";
import {User} from "./User.ts";
import {ManyToOne} from "../../../../src/decorator/relations/ManyToOne.ts";

@Entity()
export class Post {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: String })
    name!: string;

    @ManyToOne(type => User)
    user!: User;

}
