import "reflect-metadata";
import {Connection} from "../../../src";
import {CockroachDriver} from "../../../src/driver/cockroachdb/CockroachDriver";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils";
import {Table} from "../../../src";
import {TableIndex} from "../../../src";

describe("query runner > create index", () => {

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

    test("should correctly create index and revert creation", () => Promise.all(connections.map(async connection => {

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
                }
            ]
        }), true);

        // clear sqls in memory to avoid removing tables when down queries executed.
        queryRunner.clearSqlMemory();

        const index = new TableIndex({ columnNames: ["name", "description"] });
        await queryRunner.createIndex("question", index);

        const uniqueIndex = new TableIndex({ columnNames: ["description"], isUnique: true });
        await queryRunner.createIndex("question", uniqueIndex);

        let table = await queryRunner.getTable("question");

        // CockroachDB stores unique indices as UNIQUE constraints
        if (connection.driver instanceof CockroachDriver) {
            expect(table!.indices.length).toEqual(1);
            expect(table!.uniques.length).toEqual(1);

        } else {
            expect(table!.indices.length).toEqual(2);
        }

        await queryRunner.executeMemoryDownSql();

        table = await queryRunner.getTable("question");
        expect(table!.indices.length).toEqual(0);
        expect(table!.uniques.length).toEqual(0);

        await queryRunner.release();
    })));

});
