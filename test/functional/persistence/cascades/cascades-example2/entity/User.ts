import {Entity} from "../../../../../../src/decorator/entity/Entity.ts";
import {PrimaryGeneratedColumn} from "../../../../../../src/decorator/columns/PrimaryGeneratedColumn.ts";
import {Question} from "./Question.ts";
import {ManyToOne} from "../../../../../../src/decorator/relations/ManyToOne.ts";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(type => Question, {
        cascade!: ["insert"],
        nullable!: true
    })
    question!: Question;

}
