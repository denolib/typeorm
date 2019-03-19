import "reflect-metadata";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils";
import {Connection} from "../../../src";
import {TestEntity} from "./entity/TestEntity";
import {PromiseUtils} from "../../../src";

describe("github issues > #1014 Transaction doesn't rollback", () => {

    let connections: Connection[];
    beforeAll(async () => connections = await createTestingConnections({
        entities: [__dirname + "/entity/*{.js,.ts}"]
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("should rollback transaction if some operation failed in it", () => Promise.all(connections.map(async connection => {

        const testEntity = new TestEntity();
        testEntity.name = "Hello Test";
        await connection.manager.save(testEntity);

        let error: any;
        try {
            await connection.transaction(manager => {
                return PromiseUtils.settle([
                    manager.remove(TestEntity, { id: 1 }),
                    Promise.reject(new Error()),
                    new Promise((resolve, reject) => reject(new Error())),
                ]);
            });
        } catch (err) { error = err; }

        expect(error).toBeInstanceOf(Error);
        const loadedTestEntity = await connection.manager.findOne(TestEntity, 1);
        expect(loadedTestEntity).not.toBeUndefined();
        expect(loadedTestEntity)!.toEqual({ id: 1, name: "Hello Test" });
    })));

});
