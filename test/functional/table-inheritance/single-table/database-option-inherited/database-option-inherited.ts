import {join as joinPaths} from "../../../../../vendor/https/deno.land/std/path/mod.ts";
import {runIfMain} from "../../../../deps/mocha.ts";
import "../../../../deps/chai.ts";
import {getDirnameOfCurrentModule, closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../../../utils/test-utils.ts";
import {Connection} from "../../../../../src/index.ts";

describe("table-inheritance > single-table > database-option-inherited", () => {

    let connections: Connection[];
    const __dirname = getDirnameOfCurrentModule(import.meta);
    before(async () => connections = await createTestingConnections({
        entities: [joinPaths(__dirname, "/entity/*.ts")]
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("should correctly inherit database option", () => Promise.all(connections.map(async connection => {

        connection.entityMetadatas.forEach(metadata =>
            metadata.database!.should.equal("test"));

    })));

});

runIfMain(import.meta);
