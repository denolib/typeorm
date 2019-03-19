import "reflect-metadata";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../../test/utils/test-utils";
import {Connection} from "../../../src";
import {Post} from "./entity/Post";
import {Category} from "./entity/Category";
import {Question} from "./entity/Question";

describe("github issues > #778 TypeORM is ignoring the `type` field when set on a PrimaryGeneratedColumn", () => {

    let connections: Connection[];
    beforeAll(async () => connections = await createTestingConnections({
        entities: [__dirname + "/entity/*{.js,.ts}"],
        enabledDrivers: ["postgres"],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("should correctly parse type from PrimaryGeneratedColumn options", () => Promise.all(connections.map(async connection => {
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

        expect(postTable!.findColumnByName("id")!.type).toEqual("integer");
        expect(categoryTable!.findColumnByName("id")!.type).toEqual("bigint");
        expect(questionTable!.findColumnByName("id")!.type).toEqual("smallint");
    })));

});
