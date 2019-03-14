import "reflect-metadata";
import {Connection} from "../../../src";
import {
    closeTestingConnections,
    createTestingConnections,
    reloadTestingDatabases
} from "../../../test/utils/test-utils";

describe("query runner > drop unique constraint", () => {

    let connections: Connection[];
    beforeAll(async () => {
        connections = await createTestingConnections({
            entities: [__dirname + "/entity/*{.js,.ts}"],
            enabledDrivers: ["mssql", "postgres", "sqlite", "oracle", "cockroachdb"], // mysql does not supports unique constraints
            schemaCreate: true,
            dropSchema: true,
        });
    });
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("should correctly drop unique constraint and revert drop", () => Promise.all(connections.map(async connection => {

        const queryRunner = connection.createQueryRunner();

        let table = await queryRunner.getTable("post");
        expect(table!.uniques.length).toEqual(2);

        // find composite unique constraint to delete
        const unique = table!.uniques.find(u => u.columnNames.length === 2);
        await queryRunner.dropUniqueConstraint(table!, unique!);

        table = await queryRunner.getTable("post");
        expect(table!.uniques.length).toEqual(1);

        await queryRunner.executeMemoryDownSql();

        table = await queryRunner.getTable("post");
        expect(table!.uniques.length).toEqual(2);

        await queryRunner.release();
    })));

});
