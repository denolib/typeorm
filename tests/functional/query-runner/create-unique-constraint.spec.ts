import "reflect-metadata";
import {Connection} from "../../../src";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../../test/utils/test-utils";
import {Table} from "../../../src";
import {TableUnique} from "../../../src/schema-builder/table/TableUnique";

describe("query runner > create unique constraint", () => {

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

    test("should correctly create unique constraint and revert creation", () => Promise.all(connections.map(async connection => {

        const queryRunner = connection.createQueryRunner();
        await queryRunner.createTable(new Table({
            name: "category",
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

        const categoryUniqueConstraint = new TableUnique({ columnNames: ["name"] });
        await queryRunner.createUniqueConstraint("category", categoryUniqueConstraint);

        const questionUniqueConstraint = new TableUnique({ columnNames: ["name", "description"] });
        await queryRunner.createUniqueConstraint("question", questionUniqueConstraint);

        let categoryTable = await queryRunner.getTable("category");
        expect(categoryTable!.findColumnByName("name")!.isUnique).toBeTruthy();
        expect(categoryTable!.uniques.length).toEqual(1);

        let questionTable = await queryRunner.getTable("question");
        // when unique constraint defined on multiple columns. each of this columns must be non-unique,
        // because they are unique only in complex.
        expect(questionTable!.findColumnByName("name")!.isUnique).toBeFalsy();
        expect(questionTable!.findColumnByName("description")!.isUnique).toBeFalsy();
        expect(questionTable!.uniques.length).toEqual(1);

        await queryRunner.executeMemoryDownSql();

        categoryTable = await queryRunner.getTable("category");
        expect(categoryTable!.findColumnByName("name")!.isUnique).toBeFalsy();
        expect(categoryTable!.uniques.length).toEqual(0);

        questionTable = await queryRunner.getTable("question");
        expect(questionTable!.findColumnByName("name")!.isUnique).toBeFalsy();
        expect(questionTable!.findColumnByName("description")!.isUnique).toBeFalsy();
        expect(questionTable!.uniques.length).toEqual(0);

        await queryRunner.release();
    })));

});
