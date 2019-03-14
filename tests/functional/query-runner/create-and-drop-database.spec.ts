import "reflect-metadata";
import {Connection} from "../../../src";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../../test/utils/test-utils";

describe("query runner > create and drop database", () => {

    let connections: Connection[];
    beforeAll(async () => {
        connections = await createTestingConnections({
            entities: [__dirname + "/entity/*{.js,.ts}"],
            enabledDrivers: ["mysql", "mssql", "cockroachdb"],
            dropSchema: true,
        });
    });
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("should correctly create and drop database and revert it", () => Promise.all(connections.map(async connection => {

        const queryRunner = connection.createQueryRunner();

        await queryRunner.createDatabase("myTestDatabase", true);
        let hasDatabase = await queryRunner.hasDatabase("myTestDatabase");
        expect(hasDatabase).toBeTruthy();

        await queryRunner.dropDatabase("myTestDatabase");
        hasDatabase = await queryRunner.hasDatabase("myTestDatabase");
        expect(hasDatabase).toBeFalsy();

        await queryRunner.executeMemoryDownSql();

        hasDatabase = await queryRunner.hasDatabase("myTestDatabase");
        expect(hasDatabase).toBeFalsy();

        await queryRunner.release();
    })));

});
