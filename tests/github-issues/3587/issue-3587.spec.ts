import "reflect-metadata";
import { closeTestingConnections, createTestingConnections, reloadTestingDatabases } from "../../../test/utils/test-utils";
import { Connection } from "../../../src";
import { EquipmentModel } from "./entity/EquipmentModel";


describe("github issues > #3587 do not generate change queries for number based enum types every time", () => {

    let connections: Connection[];
    beforeAll(async () => connections = await createTestingConnections({
        entities: [EquipmentModel],
        enabledDrivers: ["postgres"]
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("should NOT generate change queries in case enum is not changed", () => Promise.all(connections.map(async function (connection) {

        await connection.synchronize(true);

        const sqlInMemory = await connection.driver.createSchemaBuilder().log();

        expect(sqlInMemory.downQueries).toEqual([]);
        expect(sqlInMemory.upQueries).toEqual([]);
    })));

});
