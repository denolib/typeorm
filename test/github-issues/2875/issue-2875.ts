import {join as joinPaths} from "../../../vendor/https/deno.land/std/path/mod.ts";
import {runIfMain} from "../../deps/mocha.ts";
import "../../deps/chai.ts";
import {getDirnameOfCurrentModule, createTestingConnections, closeTestingConnections, reloadTestingDatabases} from "../../utils/test-utils.ts";
import {Connection} from "../../../src/connection/Connection.ts";
import {Migration} from "../../../src/migration/Migration.ts";

describe("github issues > #2875 runMigrations() function is not returning a list of migrated files", () => {
    let connections: Connection[];
    const __dirname = getDirnameOfCurrentModule(import.meta);
    before(async () => connections = await createTestingConnections({
        entities: [joinPaths(__dirname, "/entity/*.ts")],
        migrations: [joinPaths(__dirname, "/migration/*.ts")],
        enabledDrivers: ["postgres"],
        schemaCreate: true,
        dropSchema: true,
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("should be able to run all necessary migrations", () => Promise.all(connections.map(async connection => {
        const mymigr: Migration[] = await connection.runMigrations();

        mymigr.length.should.be.equal(1);
        mymigr[0].name.should.be.equal("InitUsers1530542855524");
    })));
});

runIfMain(import.meta);
