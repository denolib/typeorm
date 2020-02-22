import {join as joinPaths} from "../../../vendor/https/deno.land/std/path/mod.ts";
import {runIfMain} from "../../deps/mocha.ts";
import "../../deps/chai.ts";
import {getDirnameOfCurrentModule, closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils.ts";
import {Connection} from "../../../src/index.ts";

// TODO: https://dev.mysql.com/doc/refman/8.0/en/server-system-variables.html#sysvar_explicit_defaults_for_timestamp
describe.skip("github issues > #1960 Migration generator produces duplicated changes", () => {

    let connections: Connection[];
    const __dirname = getDirnameOfCurrentModule(import.meta);
    before(async () => connections = await createTestingConnections({
        entities: [joinPaths(__dirname, "/entity/*.ts")],
        enabledDrivers: ["mysql"],
        logging: true
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("should not execute any alter queries", () => Promise.all(connections.map(async function(connection) {
        const sqlInMemory = await connection.driver.createSchemaBuilder().log();
        sqlInMemory.upQueries.length.should.be.equal(0);
    })));

});

runIfMain(import.meta);
