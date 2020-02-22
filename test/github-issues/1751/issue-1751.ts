import {join as joinPaths} from "../../../vendor/https/deno.land/std/path/mod.ts";
import {runIfMain} from "../../deps/mocha.ts";
import "../../deps/chai.ts";
import {Connection} from "../../../src/connection/Connection.ts";
import {getDirnameOfCurrentModule, closeTestingConnections, createTestingConnections} from "../../utils/test-utils.ts";

describe("github issues > #1751 Create sequence repeatedly when it already exists", () => {

    let connections: Connection[];
    const __dirname = getDirnameOfCurrentModule(import.meta);
    before(async () => {
        connections = await createTestingConnections({
            entities: [joinPaths(__dirname, "/entity/*.ts")],
            enabledDrivers: ["postgres"],
            schemaCreate: true,
            dropSchema: true,
        });
    });
    after(() => closeTestingConnections(connections));

    it("should correctly synchronize schema", () => Promise.all(connections.map(async connection => {
        await connection.synchronize();
    })));

});

runIfMain(import.meta);
