import "reflect-metadata";
import {Connection} from "../../../src";
import {closeTestingConnections, createTestingConnections} from "../../../test/utils/test-utils";

describe("github issues > #1615 Datetime2 with any precision result in datetime2(7) in database", () => {

    let connections: Connection[];
    beforeAll(async () => {
        connections = await createTestingConnections({
            entities: [__dirname + "/entity/*{.js,.ts}"],
            enabledDrivers: ["mssql"],
            schemaCreate: true,
            dropSchema: true,
        });
    });
    afterAll(() => closeTestingConnections(connections));

    test("should correctly create column with Datetime2 type and any precision", () => Promise.all(connections.map(async connection => {

        const queryRunner = connection.createQueryRunner();
        const table = await queryRunner.getTable("Foo");
        expect(table!.findColumnByName("date")!.type).toEqual("datetime2");
        expect(table!.findColumnByName("date")!.precision)!.toEqual(0);
        await queryRunner.release();

    })));

});
