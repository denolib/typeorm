import {join as joinPaths} from "../../../vendor/https/deno.land/std/path/mod.ts";
import {runIfMain} from "../../deps/mocha.ts";
import {expect} from "../../deps/chai.ts";
import { getDirnameOfCurrentModule, createTestingConnections, closeTestingConnections, reloadTestingDatabases } from "../../utils/test-utils.ts";
import { Connection } from "../../../src/connection/Connection.ts";

describe("github issues > #2733 should correctly handle function calls with upercase letters as default values", () => {

    let connections: Connection[];
    const __dirname = getDirnameOfCurrentModule(import.meta);

    it("MSSQL, Sqljs, Sqlite", async () => {
        connections = await createTestingConnections({
            entities: [joinPaths(__dirname, "/entity/MSSQLDummy.ts")],
            schemaCreate: true,
            dropSchema: true,
            enabledDrivers: ["mssql", "sqljs", "sqlite"],
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
    it("Postgres", async () => {
        connections = await createTestingConnections({
            entities: [joinPaths(__dirname, "/entity/PostgresDummy.ts")],
            schemaCreate: true,
            dropSchema: true,
            enabledDrivers: ["postgres"],
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
});

runIfMain(import.meta);
