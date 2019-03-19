import "reflect-metadata";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../../../utils/test-utils";
import {Connection} from "../../../../../src";
import {Question} from "./entity/Question";
import {Answer} from "./entity/Answer";
import {Photo} from "./entity/Photo";
import {User} from "./entity/User";

describe("persistence > cascades > example 2", () => {

    let connections: Connection[];
    beforeAll(async () => connections = await createTestingConnections({
        entities: [__dirname + "/entity/*{.js,.ts}"],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("should insert everything by cascades properly", () => Promise.all(connections.map(async connection => {

        const photo = new Photo();
        const user = new User();

        const answer1 = new Answer();
        answer1.photo = photo;
        answer1.user = user;

        const answer2 = new Answer();
        answer2.photo = photo;
        answer2.user = user;

        const question = new Question();
        question.answers = [answer1, answer2];
        user.question = question;

        await connection.manager.save(question);

        const loadedQuestion = await connection.manager
            .createQueryBuilder(Question, "question")
            .leftJoinAndSelect("question.answers", "answer")
            .leftJoinAndSelect("answer.photo", "answerPhoto")
            .leftJoinAndSelect("answer.user", "answerUser")
            .leftJoinAndSelect("answerUser.question", "userQuestion")
            .getOne();

        expect(loadedQuestion)!.toEqual({
            id: 1,
            answers: [{
                id: 1,
                photo: {
                    id: 1
                },
                user: {
                    id: 1,
                    question: {
                        id: 1
                    }
                }
            }, {
                id: 2,
                photo: {
                    id: 1
                },
                user: {
                    id: 1,
                    question: {
                        id: 1
                    }
                }
            }]
        });
    })));

});
