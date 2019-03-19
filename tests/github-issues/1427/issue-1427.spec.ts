import "reflect-metadata";
import {Connection} from "../../../src";
import {closeTestingConnections, createTestingConnections} from "../../utils/test-utils";

describe("github issues > #1427 precision and scale column types with errant behavior", () => {

    let connections: Connection[];
    beforeAll(async () => {
        connections = await createTestingConnections({
            entities: [__dirname + "/entity/*{.js,.ts}"],
            enabledDrivers: ["mysql"],
            schemaCreate: true,
            dropSchema: true,
        });
    });
    afterAll(() => closeTestingConnections(connections));

    test("should correctly create column with precision and scale", () => Promise.all(connections.map(async connection => {
        const queryRunner = connection.createQueryRunner();
        let table = await queryRunner.getTable("post");
        await queryRunner.release();

        expect(table!.findColumnByName("qty")!.type).toEqual("decimal");
        expect(table!.findColumnByName("qty")!.precision)!.toEqual(10);
        expect(table!.findColumnByName("qty")!.scale)!.toEqual(6);
    })));

});
