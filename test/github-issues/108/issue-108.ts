import {join as joinPaths} from "../../../vendor/https/deno.land/std/path/mod.ts";
import {runIfMain} from "../../deps/mocha.ts";
import {expect} from "../../deps/chai.ts";
import {getDirnameOfCurrentModule, closeTestingConnections, createTestingConnections} from "../../utils/test-utils.ts";
import {Connection} from "../../../src/connection/Connection.ts";

describe("github issues > #108 Error with constraint names on postgres", () => {

    let connections: Connection[];
    const __dirname = getDirnameOfCurrentModule(import.meta);
    before(async () => connections = await createTestingConnections({
        entities: [joinPaths(__dirname, "/entity/*.ts")],
        schemaCreate: true,
        dropSchema: true,
    }));
    after(() => closeTestingConnections(connections));

    it("should sync even when there unqiue constraints placed on similarly named columns", () => Promise.all(connections.map(async connection => {
       // By virtue that we got here means that it must have worked.
       expect(true).is.true;
    })));

});

runIfMain(import.meta);
