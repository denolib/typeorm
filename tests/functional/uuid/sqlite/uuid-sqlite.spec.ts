import "reflect-metadata";
import {Connection} from "../../../../src";
import {
    closeTestingConnections,
    createTestingConnections,
    reloadTestingDatabases
} from "../../../utils/test-utils";
import {Post} from "./entity/Post";
import {Question} from "./entity/Question";

describe("uuid-sqlite", () => {

    let connections: Connection[];
    beforeAll(async () => {
        connections = await createTestingConnections({
            entities: [__dirname + "/entity/*{.js,.ts}"],
            enabledDrivers: ["sqlite"],
        });
    });
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("should persist uuid correctly when it is generated non primary column", () => Promise.all(connections.map(async connection => {

        const postRepository = connection.getRepository(Post);
        const questionRepository = connection.getRepository(Question);
        const queryRunner = connection.createQueryRunner();
        const postTable = await queryRunner.getTable("post");
        const questionTable = await queryRunner.getTable("question");
        await queryRunner.release();

        const post = new Post();
        await postRepository.save(post);
        const loadedPost = await postRepository.findOne(1);
        expect(loadedPost!.uuid).toBeDefined();
        expect(postTable!.findColumnByName("uuid")!.type).toEqual("varchar");

        const post2 = new Post();
        post2.uuid = "fd357b8f-8838-42f6-b7a2-ae027444e895";
        await postRepository.save(post2);
        const loadedPost2 = await postRepository.findOne(2);
        expect(loadedPost2!.uuid).toEqual("fd357b8f-8838-42f6-b7a2-ae027444e895");

        const question = new Question();
        question.uuid2 = "fd357b8f-8838-42f6-b7a2-ae027444e895";
        const savedQuestion = await questionRepository.save(question);
        const loadedQuestion = await questionRepository.findOne(savedQuestion.id);
        expect(loadedQuestion!.id).toBeDefined();
        expect(loadedQuestion!.uuid).toBeDefined();
        expect(loadedQuestion!.uuid2).toEqual("fd357b8f-8838-42f6-b7a2-ae027444e895");
        expect(loadedQuestion!.uuid3).toBeNull();
        expect(loadedQuestion!.uuid4).toBeDefined();
        expect(questionTable!.findColumnByName("id")!.type).toEqual("varchar");
        expect(questionTable!.findColumnByName("uuid")!.type).toEqual("varchar");
        expect(questionTable!.findColumnByName("uuid2")!.type).toEqual("varchar");
        expect(questionTable!.findColumnByName("uuid3")!.type).toEqual("varchar");

        const question2 = new Question();
        question2.id = "1ecad7f6-23ee-453e-bb44-16eca26d5189";
        question2.uuid = "35b44650-b2cd-44ec-aa54-137fbdf1c373";
        question2.uuid2 = "fd357b8f-8838-42f6-b7a2-ae027444e895";
        question2.uuid3 = null;
        question2.uuid4 = null;
        await questionRepository.save(question2);
        const loadedQuestion2 = await questionRepository.findOne("1ecad7f6-23ee-453e-bb44-16eca26d5189");
        expect(loadedQuestion2!.id).toEqual("1ecad7f6-23ee-453e-bb44-16eca26d5189");
        expect(loadedQuestion2!.uuid).toEqual("35b44650-b2cd-44ec-aa54-137fbdf1c373");
        expect(loadedQuestion2!.uuid2).toEqual("fd357b8f-8838-42f6-b7a2-ae027444e895");
        expect(loadedQuestion2!.uuid3).toBeNull();
        expect(loadedQuestion2!.uuid4).toBeNull();
    })));
});
