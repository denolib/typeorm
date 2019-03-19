import "reflect-metadata";
import {Connection} from "../../../src";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils";

describe("query runner > drop foreign key", () => {

    let connections: Connection[];
    beforeAll(async () => {
        connections = await createTestingConnections({
            entities: [__dirname + "/entity/*{.js,.ts}"],
            schemaCreate: true,
            dropSchema: true,
        });
    });
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("should correctly drop foreign key and revert drop", () => Promise.all(connections.map(async connection => {

        const queryRunner = connection.createQueryRunner();

        let table = await queryRunner.getTable("student");
        expect(table!.foreignKeys.length).toEqual(2);

        await queryRunner.dropForeignKey(table!, table!.foreignKeys[0]);

        table = await queryRunner.getTable("student");
        expect(table!.foreignKeys.length).toEqual(1);

        await queryRunner.executeMemoryDownSql();

        table = await queryRunner.getTable("student");
        expect(table!.foreignKeys.length).toEqual(2);

        await queryRunner.release();
    })));

});
