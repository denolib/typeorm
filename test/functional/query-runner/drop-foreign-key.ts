import {join as joinPaths} from "../../../vendor/https/deno.land/std/path/mod.ts";
import {runIfMain} from "../../deps/mocha.ts";
import "../../deps/chai.ts";
import {Connection} from "../../../src/connection/Connection.ts";
import {getDirnameOfCurrentModule, closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils.ts";

describe("query runner > drop foreign key", () => {

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

    it("should correctly drop foreign key and revert drop", () => Promise.all(connections.map(async connection => {

        const queryRunner = connection.createQueryRunner();

        let table = await queryRunner.getTable("student");
        table!.foreignKeys.length.should.be.equal(2);

        await queryRunner.dropForeignKey(table!, table!.foreignKeys[0]);

        table = await queryRunner.getTable("student");
        table!.foreignKeys.length.should.be.equal(1);

        await queryRunner.executeMemoryDownSql();

        table = await queryRunner.getTable("student");
        table!.foreignKeys.length.should.be.equal(2);

        await queryRunner.release();
    })));

});

runIfMain(import.meta);
