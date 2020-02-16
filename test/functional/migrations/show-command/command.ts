import {join as joinPaths} from "../../../../vendor/https/deno.land/std/path/mod.ts";
import {getDirnameOfCurrentModule, createTestingConnections, closeTestingConnections, reloadTestingDatabases} from "../../../utils/test-utils.ts";
import {Connection} from "../../../../src/connection/Connection.ts";
import "../../../deps/chai.ts";
import {runIfMain} from "../../../deps/mocha.ts";

describe("migrations > show command", function() {
    let connections: Connection[];
    const __dirname = getDirnameOfCurrentModule(import.meta);
    before(async () => connections = await createTestingConnections({
        migrations: [joinPaths(__dirname, "/migration/*.ts")],
        enabledDrivers: ["sqlite", "postgres"],
        schemaCreate: true,
        dropSchema: true,
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("can recognise pending migrations", () => Promise.all(connections.map(async connection => {
        const migrations = await connection.showMigrations();
        migrations.should.be.equal(true);
    })));

    it("can recognise no pending migrations", () => Promise.all(connections.map(async connection => {
        await connection.runMigrations();
        const migrations = await connection.showMigrations();
        migrations.should.be.equal(false);
    })));
});

runIfMain(import.meta);
