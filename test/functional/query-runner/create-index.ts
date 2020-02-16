import {join as joinPaths} from "../../../vendor/https/deno.land/std/path/mod.ts";
import {runIfMain} from "../../deps/mocha.ts";
import "../../deps/chai.ts";
import {Connection} from "../../../src/connection/Connection.ts";
// TODO(uki00a) uncomment this when CockroachDriver is implemented.
// import {CockroachDriver} from "../../../src/driver/cockroachdb/CockroachDriver.ts";
import {getDirnameOfCurrentModule, closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils.ts";
import {Table} from "../../../src/schema-builder/table/Table.ts";
import {TableIndex} from "../../../src/schema-builder/table/TableIndex.ts";

describe("query runner > create index", () => {

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

    it("should correctly create index and revert creation", () => Promise.all(connections.map(async connection => {

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
        if (false/*connection.driver instanceof CockroachDriver*/) { // TODO(uki00a) uncomment this when CockroachDriver is implemented.
            table!.indices.length.should.be.equal(1);
            table!.uniques.length.should.be.equal(1);

        } else {
            table!.indices.length.should.be.equal(2);
        }

        await queryRunner.executeMemoryDownSql();

        table = await queryRunner.getTable("question");
        table!.indices.length.should.be.equal(0);
        table!.uniques.length.should.be.equal(0);

        await queryRunner.release();
    })));

});

runIfMain(import.meta);
