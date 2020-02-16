import {join as joinPaths} from "../../../vendor/https/deno.land/std/path/mod.ts";
import {runIfMain} from "../../deps/mocha.ts";
import "../../deps/chai.ts";
import {Connection} from "../../../src/index.ts";
import {getDirnameOfCurrentModule, closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils.ts";
import {Table} from "../../../src/index.ts";
import {TableExclusion} from "../../../src/schema-builder/table/TableExclusion.ts";

describe("query runner > create exclusion constraint", () => {

    let connections: Connection[];
    const __dirname = getDirnameOfCurrentModule(import.meta);
    before(async () => {
        connections = await createTestingConnections({
            entities: [joinPaths(__dirname, "/entity/*.ts")],
            enabledDrivers: ["postgres"], // Only PostgreSQL supports exclusion constraints.
            schemaCreate: true,
            dropSchema: true,
        });
    });
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("should correctly create exclusion constraint and revert creation", () => Promise.all(connections.map(async connection => {

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
        table!.exclusions.length.should.be.equal(2);

        await queryRunner.executeMemoryDownSql();

        table = await queryRunner.getTable("question");
        table!.exclusions.length.should.be.equal(0);

        await queryRunner.release();
    })));

});

runIfMain(import.meta);
