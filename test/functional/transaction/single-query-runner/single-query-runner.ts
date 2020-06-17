import {runIfMain} from "../../../deps/mocha.ts";
import {expect} from "../../../deps/chai.ts";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../../utils/test-utils.ts";
import {Connection} from "../../../../src/connection/Connection.ts";
import {Post} from "./entity/Post.ts";
import {PostRepository} from "./repository/PostRepository.ts";

describe("transaction > single query runner", () => {

    let connections: Connection[];
    before(async () => connections = await createTestingConnections({
        entities: [Post],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("should execute all operations in the method in a transaction", () => Promise.all(connections.map(async connection => {
        return connection.transaction(async transactionalEntityManager => {
            const originalQueryRunner = transactionalEntityManager.queryRunner;

            expect(originalQueryRunner).to.exist;
            expect(transactionalEntityManager.getRepository(Post).queryRunner).to.exist;
            transactionalEntityManager.getRepository(Post).queryRunner!.should.be.equal(originalQueryRunner);
            transactionalEntityManager.getRepository(Post).manager.should.be.equal(transactionalEntityManager);

            transactionalEntityManager.getCustomRepository(PostRepository).getManager().should.be.equal(transactionalEntityManager);
        });
    })));

    it("should execute all operations in the method in a transaction (#804)", () => Promise.all(connections.map(async connection => {
        const entityManager = connection.createQueryRunner().manager;
        entityManager.should.not.be.equal(connection.manager);
        entityManager.queryRunner!.should.be.equal(entityManager.queryRunner);

        await entityManager.save(new Post(undefined, "Hello World"));

        await entityManager.queryRunner!.startTransaction();
        const loadedPost1 = await entityManager.findOne(Post, { title: "Hello World" });
        expect(loadedPost1).to.be.eql({ id: 1, title: "Hello World" });
        await entityManager.remove(loadedPost1!);
        const loadedPost2 = await entityManager.findOne(Post, { title: "Hello World" });
        expect(loadedPost2).to.be.undefined;
        await entityManager.queryRunner!.rollbackTransaction();

        const loadedPost3 = await entityManager.findOne(Post, { title: "Hello World" });
        expect(loadedPost3).to.be.eql({ id: 1, title: "Hello World" });

        await entityManager.queryRunner!.startTransaction();
        const loadedPost4 = await entityManager.findOne(Post, { title: "Hello World" });
        expect(loadedPost4).to.be.eql({ id: 1, title: "Hello World" });
        await entityManager.query(`DELETE FROM ${connection.driver.escape("post")}`);
        const loadedPost5 = await entityManager.findOne(Post, { title: "Hello World" });
        expect(loadedPost5).to.be.undefined;
        await entityManager.queryRunner!.rollbackTransaction();

        const loadedPost6 = await entityManager.findOne(Post, { title: "Hello World" });
        expect(loadedPost6).to.be.eql({ id: 1, title: "Hello World" });
        await entityManager.queryRunner!.release();
    })));

});

runIfMain(import.meta);
