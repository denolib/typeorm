import {join as joinPaths} from "../../../vendor/https/deno.land/std/path/mod.ts";
import {runIfMain} from "../../deps/mocha.ts";
import { createTestingConnections, closeTestingConnections, getDirnameOfCurrentModule } from "../../utils/test-utils.ts";
import { Connection } from "../../../src/connection/Connection.ts";

describe("github issues > #1139 mysql primary generated uuid ER_TOO_LONG_KEY", () => {
    let connections: Connection[];
    const __dirname = getDirnameOfCurrentModule(import.meta);
    after(() => closeTestingConnections(connections));
    it("correctly create primary generated uuid column", async () => connections = await createTestingConnections({
        entities: [joinPaths(__dirname, "/entity/*.ts")],
        enabledDrivers: ["mysql"],
        schemaCreate: true,
        dropSchema: true,
    }));
});

runIfMain(import.meta);
