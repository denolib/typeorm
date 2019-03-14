import "reflect-metadata";
import {Connection} from "../../../src";
import {Table} from "../../../src";
import {TableExclusion} from "../../../src/schema-builder/table/TableExclusion";
import {
    closeTestingConnections,
    createTestingConnections,
    reloadTestingDatabases
} from "../../../test/utils/test-utils";

describe("query runner > create exclusion constraint", () => {

    let connections: Connection[];
    beforeAll(async () => {
        connections = await createTestingConnections({
            entities: [__dirname + "/entity/*{.js,.ts}"],
            enabledDrivers: ["postgres"], // Only PostgreSQL supports exclusion constraints.
            schemaCreate: true,
            dropSchema: true,
        });
    });
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("should correctly create exclusion constraint and revert creation", () => Promise.all(connections.map(async connection => {

        const queryRunner = connection.createQueryRunner();
        await queryRunner.createTable(new Table({
            name: "question",
            columns: [
                {
                    name: "id",
                    type: "int",
                    isPrimary: true
                },
                {
                    name: "name",
                    type: "varchar",
                },
                {
                    name: "description",
                    type: "varchar",
                },
                {
                    name: "version",
                    type: "int",
                }
            ]
        }), true);

        // clear sqls in memory to avoid removing tables when down queries executed.
        queryRunner.clearSqlMemory();

        const driver = connection.driver;
        const exclusion1 = new TableExclusion({ expression: `USING gist (${driver.escape("name")} WITH =)` });
        const exclusion2 = new TableExclusion({ expression: `USING gist (${driver.escape("id")} WITH =)` });
        await queryRunner.createExclusionConstraints("question", [exclusion1, exclusion2]);

        let table = await queryRunner.getTable("question");
        expect(table!.exclusions.length).toEqual(2);

        await queryRunner.executeMemoryDownSql();

        table = await queryRunner.getTable("question");
        expect(table!.exclusions.length).toEqual(0);

        await queryRunner.release();
    })));

});
