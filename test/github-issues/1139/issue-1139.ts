import {runIfMain} from "../../deps/mocha.ts";
import { createTestingConnections, closeTestingConnections } from "../../utils/test-utils.ts";
import { Connection } from "../../../src/connection/Connection.ts";
import {User} from "./entity/User.ts";

describe("github issues > #1139 mysql primary generated uuid ER_TOO_LONG_KEY", () => {
    let connections: Connection[];
    after(() => closeTestingConnections(connections));
    it("correctly create primary generated uuid column", async () => connections = await createTestingConnections({
        entities: [User],
        enabledDrivers: ["mysql"],
        schemaCreate: true,
        dropSchema: true,
    }));
});

runIfMain(import.meta);
