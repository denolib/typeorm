import {runIfMain} from "../../deps/mocha.ts";
import {expect} from "../../deps/chai.ts";
import { createTestingConnections, closeTestingConnections, reloadTestingDatabases } from "../../utils/test-utils.ts";
import { Connection } from "../../../src/connection/Connection.ts";
import {Session} from "./entity/mysql.ts";

it("github issues > #3588 Migration:generate issue with onUpdate using mysql 8.0", async () => {
    let connections: Connection[];
    connections = await createTestingConnections({
        entities: [Session],
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
