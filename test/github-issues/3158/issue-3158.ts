import {runIfMain} from "../../deps/mocha.ts";
import {expect} from "../../deps/chai.ts";
import { createTestingConnections, closeTestingConnections, reloadTestingDatabases } from "../../utils/test-utils.ts";
import { Connection } from "../../../src/connection/Connection.ts";
import {Session} from "./entity/Session.ts";
import {SessionSettings} from "./entity/SessionSettings.ts";

it("github issues > #3158 Cannot run sync a second time", async () => {
    let connections: Connection[];
    connections = await createTestingConnections({
        entities: [Session, SessionSettings],
        schemaCreate: true,
        dropSchema: true,
        enabledDrivers: ["mysql", "mariadb", "oracle", "mssql", "sqljs", "sqlite"],
        // todo(AlexMesser): check why tests are failing under postgres driver
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
