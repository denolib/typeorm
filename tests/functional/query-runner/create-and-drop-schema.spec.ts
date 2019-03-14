import "reflect-metadata";
import {Connection} from "../../../src";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../../test/utils/test-utils";

describe("query runner > create and drop schema", () => {

    let connections: Connection[];
    beforeAll(async () => {
        connections = await createTestingConnections({
            entities: [__dirname + "/entity/*{.js,.ts}"],
            enabledDrivers: ["mssql", "postgres"],
            dropSchema: true,
        });
    });
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("should correctly create and drop schema and revert it", () => Promise.all(connections.map(async connection => {

        const queryRunner = connection.createQueryRunner();

        await queryRunner.createSchema("myTestSchema", true);
        let hasSchema = await queryRunner.hasSchema("myTestSchema");
        expect(hasSchema).toBeTruthy();

        await queryRunner.dropSchema("myTestSchema");
        hasSchema = await queryRunner.hasSchema("myTestSchema");
        expect(hasSchema).toBeFalsy();

        await queryRunner.executeMemoryDownSql();

        hasSchema = await queryRunner.hasSchema("myTestSchema");
        expect(hasSchema).toBeFalsy();

        await queryRunner.release();
    })));

});
