import {Entity} from "../../../../../src/decorator/entity/Entity.ts";
import {Column} from "../../../../../src/decorator/columns/Column.ts";
import {PrimaryGeneratedColumn} from "../../../../../src/decorator/columns/PrimaryGeneratedColumn.ts";

@Entity({ database: "secondDB",  schema!: "answers" })
export class Answer {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: String })
    text!: string;

    @Column({ type: Number })
    questionId!: number;

}
