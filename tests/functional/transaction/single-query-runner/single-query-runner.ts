import "reflect-metadata";
import {Connection} from "../../../../src";
import {Post} from "./entity/Post";
import {PostRepository} from "./repository/PostRepository";
import {
    closeTestingConnections,
    createTestingConnections,
    reloadTestingDatabases
} from "../../../utils/test-utils";

describe("transaction > single query runner", () => {

    let connections: Connection[];
    beforeAll(async () => connections = await createTestingConnections({
        entities: [__dirname + "/entity/*{.js,.ts}"],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("should execute all operations in the method in a transaction", () => Promise.all(connections.map(async connection => {
        return connection.transaction(async transactionalEntityManager => {
            const originalQueryRunner = transactionalEntityManager.queryRunner;

            expect(originalQueryRunner).toBeDefined();
            expect(transactionalEntityManager.getRepository(Post).queryRunner).toBeDefined();
            expect(transactionalEntityManager.getRepository(Post).queryRunner!).toEqual(originalQueryRunner);
            expect(transactionalEntityManager.getRepository(Post).manager).toEqual(transactionalEntityManager);
            expect(transactionalEntityManager.getCustomRepository(PostRepository).getManager()).toEqual(transactionalEntityManager);
        });
    })));

    test("should execute all operations in the method in a transaction (#804)", () => Promise.all(connections.map(async connection => {
        const entityManager = connection.createQueryRunner().manager;
        expect(entityManager).toEqual(connection.manager);
        expect(entityManager.queryRunner!).toEqual(entityManager.queryRunner);

        await entityManager.save(new Post(undefined, "Hello World"));

        await entityManager.queryRunner!.startTransaction();
        const loadedPost1 = await entityManager.findOne(Post, { title: "Hello World" });
        expect(loadedPost1).toEqual({ id: 1, title: "Hello World" });
        await entityManager.remove(loadedPost1!);
        const loadedPost2 = await entityManager.findOne(Post, { title: "Hello World" });
        expect(loadedPost2).toBeUndefined();
        await entityManager.queryRunner!.rollbackTransaction();

        const loadedPost3 = await entityManager.findOne(Post, { title: "Hello World" });
        expect(loadedPost3).toEqual({ id: 1, title: "Hello World" });

        await entityManager.queryRunner!.startTransaction();
        const loadedPost4 = await entityManager.findOne(Post, { title: "Hello World" });
        expect(loadedPost4).toEqual({ id: 1, title: "Hello World" });
        await entityManager.query(`DELETE FROM ${connection.driver.escape("post")}`);
        const loadedPost5 = await entityManager.findOne(Post, { title: "Hello World" });
        expect(loadedPost5).toBeUndefined();
        await entityManager.queryRunner!.rollbackTransaction();

        const loadedPost6 = await entityManager.findOne(Post, { title: "Hello World" });
        expect(loadedPost6).toEqual({ id: 1, title: "Hello World" });
        await entityManager.queryRunner!.release();
    })));

});
