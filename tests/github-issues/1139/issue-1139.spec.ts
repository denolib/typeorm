import "reflect-metadata";
import { createTestingConnections, closeTestingConnections } from "../../utils/test-utils";
import { Connection } from "../../../src";

describe("github issues > #1139 mysql primary generated uuid ER_TOO_LONG_KEY", () => {
    let connections: Connection[];
    afterAll(() => closeTestingConnections(connections));
    test("correctly create primary generated uuid column", async () => connections = await createTestingConnections({
        entities: [__dirname + "/entity/*{.js,.ts}"],
        enabledDrivers: ["mysql"],
        schemaCreate: true,
        dropSchema: true,
    }));
});
