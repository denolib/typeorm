import {runIfMain} from "../../../deps/mocha.ts";
import {expect} from "../../../deps/chai.ts";
import {Connection} from "../../../../src/index.ts";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../../utils/test-utils.ts";
import {Post} from "./entity/Post.ts";
import {Question} from "./entity/Question.ts";

describe("uuid-mysql", () => {

    let connections: Connection[];
    before(async () => {
        connections = await createTestingConnections({
            entities: [Post, Question],
            enabledDrivers: ["sap"],
        });
    });
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("should persist uuid correctly when it is generated non primary column", () => Promise.all(connections.map(async connection => {

        const postRepository = connection.getRepository(Post);
        const questionRepository = connection.getRepository(Question);
        const queryRunner = connection.createQueryRunner();
        const postTable = await queryRunner.getTable("post");
        const questionTable = await queryRunner.getTable("question");
        await queryRunner.release();

        const post = new Post();
        await postRepository.save(post);
        const loadedPost = await postRepository.findOne(1);
        expect(loadedPost!.uuid).to.be.exist;
        postTable!.findColumnByName("uuid")!.type.should.be.equal("nvarchar");

        const post2 = new Post();
        post2.uuid = "fd357b8f-8838-42f6-b7a2-ae027444e895";
        await postRepository.save(post2);
        const loadedPost2 = await postRepository.findOne(2);
        expect(loadedPost2!.uuid).to.equal("fd357b8f-8838-42f6-b7a2-ae027444e895");

        const question = new Question();
        question.uuid2 = "fd357b8f-8838-42f6-b7a2-ae027444e895";
        const savedQuestion = await questionRepository.save(question);
        const loadedQuestion = await questionRepository.findOne(savedQuestion.id);
        expect(loadedQuestion!.id).to.be.exist;
        expect(loadedQuestion!.uuid).to.be.exist;
        expect(loadedQuestion!.uuid2).to.equal("fd357b8f-8838-42f6-b7a2-ae027444e895");
        expect(loadedQuestion!.uuid3).to.be.null;
        expect(loadedQuestion!.uuid4).to.be.exist;
        questionTable!.findColumnByName("id")!.type.should.be.equal("nvarchar");
        questionTable!.findColumnByName("uuid")!.type.should.be.equal("nvarchar");
        questionTable!.findColumnByName("uuid2")!.type.should.be.equal("nvarchar");
        questionTable!.findColumnByName("uuid3")!.type.should.be.equal("nvarchar");

        const question2 = new Question();
        question2.id = "1ecad7f6-23ee-453e-bb44-16eca26d5189";
        question2.uuid = "35b44650-b2cd-44ec-aa54-137fbdf1c373";
        question2.uuid2 = "fd357b8f-8838-42f6-b7a2-ae027444e895";
        question2.uuid3 = null;
        question2.uuid4 = null;
        await questionRepository.save(question2);
        const loadedQuestion2 = await questionRepository.findOne("1ecad7f6-23ee-453e-bb44-16eca26d5189");
        expect(loadedQuestion2!.id).to.equal("1ecad7f6-23ee-453e-bb44-16eca26d5189");
        expect(loadedQuestion2!.uuid).to.equal("35b44650-b2cd-44ec-aa54-137fbdf1c373");
        expect(loadedQuestion2!.uuid2).to.equal("fd357b8f-8838-42f6-b7a2-ae027444e895");
        expect(loadedQuestion2!.uuid3).to.be.null;
        expect(loadedQuestion2!.uuid4).to.be.null;
    })));

    it("should set generated uuid in the model after save", () => Promise.all(connections.map(async connection => {
        const question = new Question();
        question.uuid2 = "fd357b8f-8838-42f6-b7a2-ae027444e895";
        await connection.manager.save(question);
        expect(question!.id).to.exist;
        expect(question!.uuid).to.exist;
        expect(question!.uuid2).to.exist;
    })));

});

runIfMain(import.meta);
