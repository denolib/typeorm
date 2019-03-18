import {Column, Entity, PrimaryGeneratedColumn} from "../../../../src";
import {User} from "./User";
import {ManyToOne} from "../../../../src/decorator/relations/ManyToOne";

@Entity()
export class Post {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @ManyToOne(type => User)
    user: User;

}
