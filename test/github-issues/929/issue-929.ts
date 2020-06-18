import {runIfMain} from "../../deps/mocha.ts";
import {expect} from "../../deps/chai.ts";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils.ts";
import {Connection} from "../../../src/connection/Connection.ts";
import { TestEntity } from "./entity/TestEntity.ts";

describe("github issues > #929 sub-queries should set their own parameters on execution", () => {

    let connections: Connection[];
    before(async () => connections = await createTestingConnections({
        entities: [TestEntity],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("should persist successfully and return persisted entity", () => Promise.all(connections.map(async connection => {

        // create objects to save
        const testEntity1 = new TestEntity();
        testEntity1.name = "Entity #1";
        await connection.manager.save(testEntity1);

        const testEntity2 = new TestEntity();
        testEntity2.name = "Entity #2";
        await connection.manager.save(testEntity2);

        const testEntity3 = new TestEntity();
        testEntity3.name = "Entity #3";
        await connection.manager.save(testEntity3);

        const testEntity4 = new TestEntity();
        testEntity4.name = "Entity #4";
        await connection.manager.save(testEntity4);

        const queryBuilder = connection.manager.createQueryBuilder(TestEntity, "testEntity");

        const subQuery = queryBuilder
            .subQuery()
            .from(TestEntity, "innerTestEntity")
            .select(["innerTestEntity.id"])
            .where("innerTestEntity.id = :innerId", { innerId: 1 });

        const results = await queryBuilder
            .select("testEntity")
            .where(`testEntity.id IN ${subQuery.getQuery()}`)
            .getMany();

        expect(results.length).to.be.equal(1);
        expect(results).to.eql([{ id: 1, name: "Entity #1" }]);
    })));

});

runIfMain(import.meta);
