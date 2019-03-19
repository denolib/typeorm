import "reflect-metadata";
import { createTestingConnections, closeTestingConnections, reloadTestingDatabases } from "../../utils/test-utils";
import { Connection } from "../../../src";

describe("github issues > #2733 should correctly handle function calls with upercase letters as default values", () => {

    let connections: Connection[];

    test("MSSQL, Sqljs, Sqlite", async () => {
        connections = await createTestingConnections({
            entities: [__dirname + "/entity/MSSQLDummy{.js,.ts}"],
            schemaCreate: true,
            dropSchema: true,
            enabledDrivers: ["mssql", "sqljs", "sqlite"],
        });
        await reloadTestingDatabases(connections);
        await Promise.all(connections.map(async connection => {
            const schemaBuilder = connection.driver.createSchemaBuilder();
            const syncQueries = await schemaBuilder.log();
            expect(syncQueries.downQueries).toEqual([]);
            expect(syncQueries.upQueries).toEqual([]);
        }));
        await closeTestingConnections(connections);
    });
    test("Postgres", async () => {
        connections = await createTestingConnections({
            entities: [__dirname + "/entity/PostgresDummy{.js,.ts}"],
            schemaCreate: true,
            dropSchema: true,
            enabledDrivers: ["postgres"],
        });
        await reloadTestingDatabases(connections);
        await Promise.all(connections.map(async connection => {
            const schemaBuilder = connection.driver.createSchemaBuilder();
            const syncQueries = await schemaBuilder.log();
            expect(syncQueries.downQueries).toEqual([]);
            expect(syncQueries.upQueries).toEqual([]);
        }));
        await closeTestingConnections(connections);
    });
});
