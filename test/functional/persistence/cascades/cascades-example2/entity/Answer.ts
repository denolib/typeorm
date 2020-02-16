import {Entity} from "../../../../../../src/decorator/entity/Entity.ts";
import {PrimaryGeneratedColumn} from "../../../../../../src/decorator/columns/PrimaryGeneratedColumn.ts";
import {ManyToOne} from "../../../../../../src/decorator/relations/ManyToOne.ts";
import {Photo} from "./Photo.ts";
import {User} from "./User.ts";
import {Question} from "./Question.ts";

@Entity()
export class Answer {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => Question, question => question.answers, {
        cascade: ["insert"],
        nullable: false
    })
    question: Question;

    @ManyToOne(type => Photo, {
        cascade: ["insert"],
        nullable: false
    })
    photo: Photo;

    @ManyToOne(type => User, {
        cascade: ["insert"],
        nullable: false
    })
    user: User;

}
