import "reflect-metadata";
import {Connection} from "../../../src";
import {closeTestingConnections, createTestingConnections} from "../../../test/utils/test-utils";

describe("github issues > #1652 Multiple primary key defined", () => {

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

    test("should correctly create table when multiple primary keys defined and one of them is generated", () => Promise.all(connections.map(async connection => {

        const queryRunner = connection.createQueryRunner();
        const table = await queryRunner.getTable("post");
        expect(table!.findColumnByName("id")!.isPrimary).toBeTruthy();
        expect(table!.findColumnByName("id")!.isGenerated).toBeTruthy();
        expect(table!.findColumnByName("id")!.generationStrategy)!.toEqual("increment");
        expect(table!.findColumnByName("name")!.isPrimary).toBeTruthy();
        await queryRunner.release();

    })));

});
