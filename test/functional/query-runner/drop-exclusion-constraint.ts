import {join as joinPaths} from "../../../vendor/https/deno.land/std/path/mod.ts";
import {runIfMain} from "../../deps/mocha.ts";
import "../../deps/chai.ts";
import {Connection} from "../../../src/connection/Connection.ts";
import {getDirnameOfCurrentModule, closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils.ts";

describe("query runner > drop exclusion constraint", () => {

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

    it("should correctly drop exclusion constraint and revert drop", () => Promise.all(connections.map(async connection => {

        const queryRunner = connection.createQueryRunner();

        let table = await queryRunner.getTable("post");
        table!.exclusions.length.should.be.equal(1);

        await queryRunner.dropExclusionConstraint(table!, table!.exclusions[0]);

        table = await queryRunner.getTable("post");
        table!.exclusions.length.should.be.equal(0);

        await queryRunner.executeMemoryDownSql();

        table = await queryRunner.getTable("post");
        table!.exclusions.length.should.be.equal(1);

        await queryRunner.release();
    })));

});

runIfMain(import.meta);
