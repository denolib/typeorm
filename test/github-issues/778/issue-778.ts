import {runIfMain} from "../../deps/mocha.ts";
import "../../deps/chai.ts";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils.ts";
import {Connection} from "../../../src/connection/Connection.ts";
import {Post} from "./entity/Post.ts";
import {Category} from "./entity/Category.ts";
import {Question} from "./entity/Question.ts";

describe("github issues > #778 TypeORM is ignoring the `type` field when set on a PrimaryGeneratedColumn", () => {

    let connections: Connection[];
    before(async () => connections = await createTestingConnections({
        entities: [Category, Post, Question],
        enabledDrivers: ["postgres"],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("should correctly parse type from PrimaryGeneratedColumn options", () => Promise.all(connections.map(async connection => {
        const queryRunner = connection.createQueryRunner();
        const postTable = await queryRunner.getTable("post");
        const categoryTable = await queryRunner.getTable("category");
        const questionTable = await queryRunner.getTable("question");
        await queryRunner.release();

        const post = new Post();
        post.name = "Post #1";
        await connection.getRepository(Post).save(post);

        const category = new Category();
        category.name = "Category #1";
        await connection.getRepository(Category).save(category);

        const question = new Question();
        question.name = "Question #1";
        await connection.getRepository(Question).save(question);

        postTable!.findColumnByName("id")!.type.should.be.equal("integer");
        categoryTable!.findColumnByName("id")!.type.should.be.equal("bigint");
        questionTable!.findColumnByName("id")!.type.should.be.equal("smallint");
    })));

});

runIfMain(import.meta);
