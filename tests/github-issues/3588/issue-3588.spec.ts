import "reflect-metadata";
import { createTestingConnections, closeTestingConnections, reloadTestingDatabases } from "../../../test/utils/test-utils";
import { Connection } from "../../../src";

test("github issues > #3588 Migration:generate issue with onUpdate using mysql 8.0", async () => {
    let connections: Connection[];
        connections = await createTestingConnections({
            entities: [__dirname + "/entity/*{.js,.ts}"],
            schemaCreate: true,
            dropSchema: true,
            enabledDrivers: ["mysql"],
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
