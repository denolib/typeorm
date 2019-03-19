import "reflect-metadata";
import { closeTestingConnections, createTestingConnections, reloadTestingDatabases } from "../../utils/test-utils";
import { Connection } from "../../../src";
import { Master } from "./entities/master";
import { Detail } from "./entities/detail";

describe("indices > create schema", () => {

    let connections: Connection[];
    beforeAll(async () => connections = await createTestingConnections({
        entities: [Master, Detail],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    describe("build schema", function () {

        test("it should just work, creating the index", () => Promise.all(connections.map(async connection => {

            await connection.synchronize(true);

        })));

    });

});
