import {join as joinPaths} from "../../../vendor/https/deno.land/std/path/mod.ts";
import {runIfMain} from "../../deps/mocha.ts";
import "../../deps/chai.ts";
import {Connection} from "../../../src/connection/Connection.ts";
// TODO(uki00a) uncomment this when CockroachDriver is implemented.
// import {CockroachDriver} from "../../../src/driver/cockroachdb/CockroachDriver.ts";
import {getDirnameOfCurrentModule, closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils.ts";
import {Table} from "../../../src/schema-builder/table/Table.ts";

describe("query runner > create primary key", () => {

    let connections: Connection[];
    const __dirname = getDirnameOfCurrentModule(import.meta);
    before(async () => {
        connections = await createTestingConnections({
            entities: [joinPaths(__dirname, "/entity/*.ts")],
            schemaCreate: true,
            dropSchema: true,
        });
    });
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("should correctly create primary key and revert creation", () => Promise.all(connections.map(async connection => {

        // CockroachDB does not allow altering primary key
        if (false/*connection.driver instanceof CockroachDriver*/) // TODO(uki00a) uncomment this when CockroachDriver is implemented.
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
        categoryTable!.findColumnByName("id")!.isPrimary.should.be.true;

        let personTable = await queryRunner.getTable("person");
        personTable!.findColumnByName("id")!.isPrimary.should.be.true;
        personTable!.findColumnByName("userId")!.isPrimary.should.be.true;

        await queryRunner.executeMemoryDownSql();

        categoryTable = await queryRunner.getTable("category");
        categoryTable!.findColumnByName("id")!.isPrimary.should.be.false;

        personTable = await queryRunner.getTable("person");
        personTable!.findColumnByName("id")!.isPrimary.should.be.false;
        personTable!.findColumnByName("userId")!.isPrimary.should.be.false;

        await queryRunner.release();
    })));

});

runIfMain(import.meta);
