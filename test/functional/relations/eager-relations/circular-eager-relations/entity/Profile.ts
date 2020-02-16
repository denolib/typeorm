import {Entity} from "../../../../../../src/decorator/entity/Entity.ts";
import {PrimaryGeneratedColumn} from "../../../../../../src/decorator/columns/PrimaryGeneratedColumn.ts";
import {Column} from "../../../../../../src/decorator/columns/Column.ts";
import {OneToOne} from "../../../../../../src/decorator/relations/OneToOne.ts";
import {User} from "./User.ts";

@Entity()
export class Profile {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: String })
    about: string;

    @OneToOne(type => User, user => user.profile, { eager: true })
    user: User;

}
