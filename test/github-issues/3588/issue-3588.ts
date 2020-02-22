import {join as joinPaths} from "../../../vendor/https/deno.land/std/path/mod.ts";
import {runIfMain} from "../../deps/mocha.ts";
import {expect} from "../../deps/chai.ts";
import { getDirnameOfCurrentModule, createTestingConnections, closeTestingConnections, reloadTestingDatabases } from "../../utils/test-utils.ts";
import { Connection } from "../../../src/connection/Connection.ts";

it("github issues > #3588 Migration:generate issue with onUpdate using mysql 8.0", async () => {
    let connections: Connection[];
    const __dirname = getDirnameOfCurrentModule(import.meta);
    connections = await createTestingConnections({
        entities: [joinPaths(__dirname, "/entity/*.ts")],
        schemaCreate: true,
        dropSchema: true,
        enabledDrivers: ["mysql"],
    });
    await reloadTestingDatabases(connections);
    await Promise.all(connections.map(async connection => {
        const schemaBuilder = connection.driver.createSchemaBuilder();
        const syncQueries = await schemaBuilder.log();
        expect(syncQueries.downQueries).to.be.eql([]);
        expect(syncQueries.upQueries).to.be.eql([]);
    }));
    await closeTestingConnections(connections);
});

runIfMain(import.meta);
