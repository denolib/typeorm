import "reflect-metadata";
import { createTestingConnections, closeTestingConnections, reloadTestingDatabases } from "../../utils/test-utils";
import { Connection } from "../../../src";

test("github issues > #3158 Cannot run sync a second time", async () => {
    let connections: Connection[];
        connections = await createTestingConnections({
            entities: [__dirname + "/entity/*{.js,.ts}"],
            schemaCreate: true,
            dropSchema: true,
            enabledDrivers: ["mysql", "mariadb", "oracle", "mssql", "sqljs", "sqlite"],
            // todo(AlexMesser): check why tests are failing under postgres driver
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
