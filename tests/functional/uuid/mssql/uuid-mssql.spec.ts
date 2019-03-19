import "reflect-metadata";
import {Connection} from "../../../../src";
import {
    closeTestingConnections,
    createTestingConnections,
    reloadTestingDatabases
} from "../../../utils/test-utils";
import {Question} from "./entity/Question";
import {Post} from "./entity/Post";

describe("uuid-mssql", () => {

    let connections: Connection[];
    beforeAll(async () => connections = await createTestingConnections({
        entities: [__dirname + "/entity/*{.js,.ts}"],
        enabledDrivers: ["mssql"]
    }));
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
        const loadedPost = await postRepository.findOne(post.id);
        expect(loadedPost!.uuid).toBeDefined();
        expect(postTable!.findColumnByName("uuid")!.type).toEqual("uniqueidentifier");

        const post2 = new Post();
        post2.uuid = "FD357B8F-8838-42F6-B7A2-AE027444E895";
        await postRepository.save(post2);
        const loadedPost2 = await postRepository.findOne(post2.id);
        expect(loadedPost2!.uuid).toEqual("FD357B8F-8838-42F6-B7A2-AE027444E895");

        const question = new Question();
        const savedQuestion = await questionRepository.save(question);
        const loadedQuestion = await questionRepository.findOne(savedQuestion.id);
        expect(loadedQuestion!.id).toBeDefined();
        expect(loadedQuestion!.uuid).toBeDefined();
        expect(loadedQuestion!.uuid2).toBeNull();
        expect(loadedQuestion!.uuid3).toBeDefined();
        expect(questionTable!.findColumnByName("id")!.type).toEqual("uniqueidentifier");
        expect(questionTable!.findColumnByName("uuid")!.type).toEqual("uniqueidentifier");
        expect(questionTable!.findColumnByName("uuid2")!.type).toEqual("uniqueidentifier");
        expect(questionTable!.findColumnByName("uuid3")!.type).toEqual("uniqueidentifier");

        const question2 = new Question();
        question2.id = "1ECAD7F6-23EE-453E-BB44-16ECA26D5189";
        question2.uuid = "35B44650-B2CD-44EC-AA54-137FBDF1C373";
        question2.uuid2 = null;
        question2.uuid3 = null;
        await questionRepository.save(question2);
        const loadedQuestion2 = await questionRepository.findOne("1ECAD7F6-23EE-453E-BB44-16ECA26D5189");
        expect(loadedQuestion2!.id).toEqual("1ECAD7F6-23EE-453E-BB44-16ECA26D5189");
        expect(loadedQuestion2!.uuid).toEqual("35B44650-B2CD-44EC-AA54-137FBDF1C373");
        expect(loadedQuestion2!.uuid2).toBeNull();
        expect(loadedQuestion2!.uuid3).toBeNull();
    })));
});
