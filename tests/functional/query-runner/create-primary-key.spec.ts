import "reflect-metadata";
import {Connection} from "../../../src";
import {CockroachDriver} from "../../../src/driver/cockroachdb/CockroachDriver";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils";
import {Table} from "../../../src";

describe("query runner > create primary key", () => {

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

    test("should correctly create primary key and revert creation", () => Promise.all(connections.map(async connection => {

        // CockroachDB does not allow altering primary key
        if (connection.driver instanceof CockroachDriver)
            return;

        const queryRunner = connection.createQueryRunner();
        await queryRunner.createTable(new Table({
            name: "category",
            columns: [
                {
                    name: "id",
                    type: "int",
                },
                {
                    name: "name",
                    type: "varchar",
                }
            ]
        }), true);

        await queryRunner.createTable(new Table({
            name: "person",
            columns: [
                {
                    name: "id",
                    type: "int",
                },
                {
                    name: "userId",
                    type: "int",
                },
                {
                    name: "name",
                    type: "varchar",
                }
            ]
        }), true);

        // clear sqls in memory to avoid removing tables when down queries executed.
        queryRunner.clearSqlMemory();

        await queryRunner.createPrimaryKey("category", ["id"]);
        await queryRunner.createPrimaryKey("person", ["id", "userId"]);

        let categoryTable = await queryRunner.getTable("category");
        expect(categoryTable!.findColumnByName("id")!.isPrimary).toBeTruthy();

        let personTable = await queryRunner.getTable("person");
        expect(personTable!.findColumnByName("id")!.isPrimary).toBeTruthy();
        expect(personTable!.findColumnByName("userId")!.isPrimary).toBeTruthy();

        await queryRunner.executeMemoryDownSql();

        categoryTable = await queryRunner.getTable("category");
        expect(categoryTable!.findColumnByName("id")!.isPrimary).toBeFalsy();

        personTable = await queryRunner.getTable("person");
        expect(personTable!.findColumnByName("id")!.isPrimary).toBeFalsy();
        expect(personTable!.findColumnByName("userId")!.isPrimary).toBeFalsy();

        await queryRunner.release();
    })));

});
