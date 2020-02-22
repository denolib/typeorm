import {join as joinPaths} from "../../../vendor/https/deno.land/std/path/mod.ts";
import {runIfMain} from "../../deps/mocha.ts";
import {expect} from "../../deps/chai.ts";
import {
    getDirnameOfCurrentModule,
    createTestingConnections,
    closeTestingConnections,
    reloadTestingDatabases
} from "../../utils/test-utils.ts";
import { Connection } from "../../../src/connection/Connection.ts";

describe("github issues > #4701 Duplicate migrations are executed.", () => {
    let connections: Connection[];
    const __dirname = getDirnameOfCurrentModule(import.meta);
    before(async () => connections = await createTestingConnections({
        migrations: [joinPaths(__dirname, "/migration/*.ts")],
        enabledDrivers: ["postgres"],
        schemaCreate: true,
        dropSchema: true
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("should throw error if there're duplicate migrations", () => Promise.all(connections.map(async connection => {
        let error;
        try {
            await connection.runMigrations();
        } catch (err) {
            error = err;
        }
        expect(error).to.be.instanceOf(Error);
        expect(error.message).to.equal("Duplicate migrations: ExampleMigrationOne1567759789051");
    })));
});

runIfMain(import.meta);
