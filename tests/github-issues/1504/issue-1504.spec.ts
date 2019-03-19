import "reflect-metadata";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils";
import {Connection} from "../../../src";
import {TestEntity1} from "./entity/TestEntity1";

describe("github issues > #1504 Cannot eagerly query Entity with relation more than 3 levels deep", () => {

    let connections: Connection[];
    beforeAll(async () => connections = await createTestingConnections({
        entities: [__dirname + "/entity/*{.js,.ts}"],
        enabledDrivers: ["postgres"]
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("should not throw an error", () => Promise.all(connections.map(async connection => {

        await connection
            .getRepository(TestEntity1)
            .findOne(1, { relations: [
                "Entity2",
                "Entity2.Entity3",
                "Entity2.Entity3.Entity4",
            ]});

    })));

});
