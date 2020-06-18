import {runIfMain} from "../../deps/mocha.ts";
import {expect} from "../../deps/chai.ts";
import {Connection} from "../../../src/connection/Connection.ts";
import {createTestingConnections, closeTestingConnections, reloadTestingDatabases} from "../../utils/test-utils.ts";
import {TestEntity} from "./entity/TestEntity.ts";

describe("github issues > #2737 MySQLDriver findChangedColumns (fields: width, precision)", () => {
    let connections: Connection[];

    before(async () => connections = await createTestingConnections({
        dropSchema: false,
        entities: [TestEntity],
        enabledDrivers: ["mysql", "aurora-data-api"],
        schemaCreate: false,
        cache: false,
        driverSpecific: {
            bigNumberStrings: false,
        },
    }));

    beforeEach(() => reloadTestingDatabases(connections));

    after(() => closeTestingConnections(connections));

    it("should not create migrations for an existing unique index when bigNumberStrings is false", async () => (
        await Promise.all(connections.map(async connection => {
            const entityMetadata = connection.entityMetadatas.find(x => x.name === "TestEntity");
            const indexMetadata = entityMetadata!.indices.find(index => (
                index.columns.some(column =>  column.propertyName === "unique_column")));

            // Ensure the setup is correct
            expect(indexMetadata).to.exist;
            expect(indexMetadata!.isUnique).to.be.true;

            await connection.synchronize(false);

            const schemaBuilder = connection.driver.createSchemaBuilder();
            const syncQueries = await schemaBuilder.log();

            expect(syncQueries.downQueries).to.be.an("array").that.is.empty;
            expect(syncQueries.upQueries).to.be.an("array").that.is.empty;
        })
    )));
});

runIfMain(import.meta);
