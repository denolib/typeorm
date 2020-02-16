import {join as joinPaths} from "../../../vendor/https/deno.land/std/path/mod.ts";
import {runIfMain} from "../../deps/mocha.ts";
import "../../deps/chai.ts";
import {Connection} from "../../../src/connection/Connection.ts";
import {getDirnameOfCurrentModule, closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils.ts";
import {Table} from "../../../src/schema-builder/table/Table.ts";
import {TableUnique} from "../../../src/schema-builder/table/TableUnique.ts";

describe("query runner > create unique constraint", () => {

    let connections: Connection[];
    const __dirname = getDirnameOfCurrentModule(import.meta);
    before(async () => {
        connections = await createTestingConnections({
            entities: [joinPaths(__dirname, "/entity/*.ts")],
            enabledDrivers: ["mssql", "postgres", "sqlite", "oracle", "cockroachdb"], // mysql and sap does not supports unique constraints
            schemaCreate: true,
            dropSchema: true,
        });
    });
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("should correctly create unique constraint and revert creation", () => Promise.all(connections.map(async connection => {

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
        categoryTable!.findColumnByName("name")!.isUnique.should.be.true;
        categoryTable!.uniques.length.should.be.equal(1);

        let questionTable = await queryRunner.getTable("question");
        // when unique constraint defined on multiple columns. each of this columns must be non-unique,
        // because they are unique only in complex.
        questionTable!.findColumnByName("name")!.isUnique.should.be.false;
        questionTable!.findColumnByName("description")!.isUnique.should.be.false;
        questionTable!.uniques.length.should.be.equal(1);

        await queryRunner.executeMemoryDownSql();

        categoryTable = await queryRunner.getTable("category");
        categoryTable!.findColumnByName("name")!.isUnique.should.be.false;
        categoryTable!.uniques.length.should.be.equal(0);

        questionTable = await queryRunner.getTable("question");
        questionTable!.findColumnByName("name")!.isUnique.should.be.false;
        questionTable!.findColumnByName("description")!.isUnique.should.be.false;
        questionTable!.uniques.length.should.be.equal(0);

        await queryRunner.release();
    })));

});

runIfMain(import.meta);
