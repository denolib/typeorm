import {Column} from "../../../../../../src/index.ts";
import {Entity} from "../../../../../../src/decorator/entity/Entity.ts";
import {PrimaryGeneratedColumn} from "../../../../../../src/decorator/columns/PrimaryGeneratedColumn.ts";
import {Answer} from "./Answer.ts";
import {OneToMany} from "../../../../../../src/decorator/relations/OneToMany.ts";

@Entity()
export class Question {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: "My question", type: String })
    name: string;

    @OneToMany(type => Answer, answer => answer.question, { cascade: ["insert"] })
    answers: Answer[];

}
