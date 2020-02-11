import {Entity} from "../../../../../../src/decorator/entity/Entity.ts";
import {PrimaryGeneratedColumn} from "../../../../../../src/decorator/columns/PrimaryGeneratedColumn.ts";
import {User} from "./User.ts";
import {Photo} from "./Photo.ts";
import {OneToOne} from "../../../../../../src/decorator/relations/OneToOne.ts";
import {JoinColumn} from "../../../../../../src/decorator/relations/JoinColumn.ts";

@Entity()
export class Profile {

    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(type => User, user => user.profile, {
        nullable: false
    })
    @JoinColumn()
    user: User;

    @OneToOne(type => Photo, {
        nullable: false,
        cascade: ["insert"]
    })
    @JoinColumn()
    photo: Photo;

}
