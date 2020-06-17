import "../../../../deps/chai.ts";
import {runIfMain} from "../../../../deps/mocha.ts";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../../../utils/test-utils.ts";
import {Connection} from "../../../../../src/connection/Connection.ts";
import {Question} from "./entity/Question.ts";
import {Answer} from "./entity/Answer.ts";
import {Photo} from "./entity/Photo.ts";
import {User} from "./entity/User.ts";

describe("persistence > cascades > example 2", () => {

    let connections: Connection[];
    before(async () => connections = await createTestingConnections({
        entities: [Answer, Photo, Question, User],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("should insert everything by cascades properly", () => Promise.all(connections.map(async connection => {

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

        loadedQuestion!.should.be.eql({
            id: 1,
            name: "My question",
            answers: [{
                id: 1,
                photo: {
                    id: 1,
                    name: "My photo"
                },
                user: {
                    id: 1,
                    question: {
                        id: 1,
                        name: "My question"
                    }
                }
            }, {
                id: 2,
                photo: {
                    id: 1,
                    name: "My photo"
                },
                user: {
                    id: 1,
                    question: {
                        id: 1,
                        name: "My question"
                    }
                }
            }]
        });
    })));

});

runIfMain(import.meta);
