import type {Question} from "../model/Question.ts";

export default {
    name: "Question",
    table: {
        name: "question"
    },
    columns: {
        id: {
            type: "int",
            primary: true,
            generated: true
        },
        title: {
            type: "varchar",
            nullable: false
        }
    },
    target: function Question(this: Question) {
        this.type = "question";
    }
};
