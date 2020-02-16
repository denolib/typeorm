import {join as joinPaths} from "../../../vendor/https/deno.land/std/path/mod.ts";
import {runIfMain} from "../../deps/mocha.ts";
import "../../deps/chai.ts";
import {Connection} from "../../../src/connection/Connection.ts";
import {getDirnameOfCurrentModule, closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils.ts";

describe("query runner > create and drop database", () => {

    let connections: Connection[];
    const __dirname = getDirnameOfCurrentModule(import.meta);
    before(async () => {
        connections = await createTestingConnections({
            entities: [joinPaths(__dirname, "/entity/*.ts")],
            enabledDrivers: ["mysql", "mssql", "cockroachdb"],
            dropSchema: true,
        });
    });
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("should correctly create and drop database and revert it", () => Promise.all(connections.map(async connection => {

        const queryRunner = connection.createQueryRunner();

        await queryRunner.createDatabase("myTestDatabase", true);
        let hasDatabase = await queryRunner.hasDatabase("myTestDatabase");
        hasDatabase.should.be.true;

        await queryRunner.dropDatabase("myTestDatabase");
        hasDatabase = await queryRunner.hasDatabase("myTestDatabase");
        hasDatabase.should.be.false;

        await queryRunner.executeMemoryDownSql();

        hasDatabase = await queryRunner.hasDatabase("myTestDatabase");
        hasDatabase.should.be.false;

        await queryRunner.release();
    })));

});

runIfMain(import.meta);
