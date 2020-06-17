import {runIfMain} from "../../deps/mocha.ts";
import {expect} from "../../deps/chai.ts";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils.ts";
import {Connection} from "../../../src/connection/Connection.ts";
import {TestEntity} from "./entity/TestEntity.ts";
import {PromiseUtils} from "../../../src/util/PromiseUtils.ts";

describe("github issues > #1014 Transaction doesn't rollback", () => {

    let connections: Connection[];
    before(async () => connections = await createTestingConnections({
        entities: [TestEntity]
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("should rollback transaction if some operation failed in it", () => Promise.all(connections.map(async connection => {

        const testEntity = new TestEntity();
        testEntity.name = "Hello Test";
        await connection.manager.save(testEntity);

        let error: any;
        try {
            await connection.transaction(manager => {
                return PromiseUtils.settle([
                    manager.remove(TestEntity, { id: 1 } as TestEntity),
                    Promise.reject(new Error()),
                    new Promise((resolve, reject) => reject(new Error())),
                ]);
            });
        } catch (err) { error = err; }

        expect(error).to.be.instanceof(Error);
        const loadedTestEntity = await connection.manager.findOne(TestEntity, 1);
        expect(loadedTestEntity).not.to.be.undefined;
        loadedTestEntity!.should.be.eql({ id: 1, name: "Hello Test" });
    })));

});

runIfMain(import.meta);
