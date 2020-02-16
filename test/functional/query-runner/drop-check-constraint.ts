import {join as joinPaths} from "../../../vendor/https/deno.land/std/path/mod.ts";
import {runIfMain} from "../../deps/mocha.ts";
import "../../deps/chai.ts";
import {Connection} from "../../../src/connection/Connection.ts";
import {getDirnameOfCurrentModule, closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils.ts";
import {MysqlDriver} from "../../../src/driver/mysql/MysqlDriver.ts";

describe("query runner > drop check constraint", () => {

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

    it("should correctly drop check constraint and revert drop", () => Promise.all(connections.map(async connection => {

        // Mysql does not support check constraints.
        if (connection.driver instanceof MysqlDriver)
            return;

        const queryRunner = connection.createQueryRunner();

        let table = await queryRunner.getTable("post");
        table!.checks.length.should.be.equal(1);

        await queryRunner.dropCheckConstraint(table!, table!.checks[0]);

        table = await queryRunner.getTable("post");
        table!.checks.length.should.be.equal(0);

        await queryRunner.executeMemoryDownSql();

        table = await queryRunner.getTable("post");
        table!.checks.length.should.be.equal(1);

        await queryRunner.release();
    })));

});

runIfMain(import.meta);
