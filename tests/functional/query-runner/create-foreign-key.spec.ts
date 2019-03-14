import "reflect-metadata";
import {Connection} from "../../../src";
import {CockroachDriver} from "../../../src/driver/cockroachdb/CockroachDriver";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../../test/utils/test-utils";
import {Table} from "../../../src";
import {TableForeignKey} from "../../../src";

describe("query runner > create foreign key", () => {

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

    test("should correctly create foreign key and revert creation", () => Promise.all(connections.map(async connection => {

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
                }
            ]
        }), true);

        await queryRunner.createTable(new Table({
            name: "answer",
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
                    name: "questionId",
                    isUnique: connection.driver instanceof CockroachDriver, // CockroachDB requires UNIQUE constraints on referenced columns
                    type: "int",
                }
            ]
        }), true);

        // clear sqls in memory to avoid removing tables when down queries executed.
        queryRunner.clearSqlMemory();

        const foreignKey = new TableForeignKey({
            columnNames: ["questionId"],
            referencedColumnNames: ["id"],
            referencedTableName: "question",
            onDelete: "CASCADE"
        });
        await queryRunner.createForeignKey("answer", foreignKey);

        let table = await queryRunner.getTable("answer");
        expect(table!.foreignKeys.length).toEqual(1);
        await queryRunner.executeMemoryDownSql();

        table = await queryRunner.getTable("answer");
        expect(table!.foreignKeys.length).toEqual(0);

        await queryRunner.release();
    })));

});
