import {join as joinPaths} from "../../../vendor/https/deno.land/std/path/mod.ts";
import {runIfMain} from "../../deps/mocha.ts";
import "../../deps/chai.ts";
import {getDirnameOfCurrentModule, closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils.ts";
import {Connection} from "../../../src/connection/Connection.ts";
import {TestEntity1} from "./entity/TestEntity1.ts";
import {TestEntity2} from "./entity/TestEntity2.ts";
import {TestEntity3} from "./entity/TestEntity3.ts";
import {TestEntity4} from "./entity/TestEntity4.ts";

describe("github issues > #1504 Cannot eagerly query Entity with relation more than 3 levels deep", () => {

    let connections: Connection[];
    before(async () => connections = await createTestingConnections({
        entities: [TestEntity1, TestEntity2, TestEntity3, TestEntity4],
        enabledDrivers: ["postgres"]
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("should not throw an error", () => Promise.all(connections.map(async connection => {

        await connection
            .getRepository(TestEntity1)
            .findOne(1, { relations: [
                "Entity2",
                "Entity2.Entity3",
                "Entity2.Entity3.Entity4",
            ]});

    })));

});

runIfMain(import.meta);
