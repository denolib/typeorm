import {join as joinPaths} from "../../../vendor/https/deno.land/std/path/mod.ts";
import {runIfMain} from "../../deps/mocha.ts";
import {expect} from "../../deps/chai.ts";
import {Connection} from "../../../src/connection/Connection.ts";
// TODO(uki00a) uncomment this when CockroachDriver is implemented.
// import {CockroachDriver} from "../../../src/driver/cockroachdb/CockroachDriver.ts";
import {getDirnameOfCurrentModule, closeTestingConnections, createTestingConnections} from "../../utils/test-utils.ts";
import {SqliteDriver} from "../../../src/driver/sqlite/SqliteDriver.ts";

describe("query runner > drop column", () => {

    let connections: Connection[];
    const __dirname = getDirnameOfCurrentModule(import.meta);
    before(async () => {
        connections = await createTestingConnections({
            entities: [joinPaths(__dirname, "/entity/*.ts")],
            schemaCreate: true,
            dropSchema: true,
        });
    });
    after(() => closeTestingConnections(connections));

    it("should correctly drop column and revert drop", () => Promise.all(connections.map(async connection => {
        // TODO(uki00a) Fix this problem. See https://github.com/denolib/typeorm/issues/14.
        if (connection.driver instanceof SqliteDriver) {
            console.warn("This test is skipped because of the issue #14. See https://github.com/denolib/typeorm/issues/14.");
            return;
        }

        const queryRunner = connection.createQueryRunner();

        let table = await queryRunner.getTable("post");
        const idColumn = table!.findColumnByName("id")!;
        const nameColumn = table!.findColumnByName("name")!;
        const versionColumn = table!.findColumnByName("version")!;
        idColumn!.should.be.exist;
        nameColumn!.should.be.exist;
        versionColumn!.should.be.exist;

        // In Sqlite 'dropColumns' method is more optimal than 'dropColumn', because it recreate table just once,
        // without all removed columns. In other drivers it's no difference between these methods, because 'dropColumns'
        // calls 'dropColumn' method for each removed column.
        // CockroachDB does not support changing pk.
        if (false/*connection.driver instanceof CockroachDriver*/) { // TODO(uki00a) uncomment this when CockroachDriver is implemented.
            await queryRunner.dropColumns(table!, [nameColumn, versionColumn]);
        } else {
            await queryRunner.dropColumns(table!, [idColumn, nameColumn, versionColumn]);
        }

        table = await queryRunner.getTable("post");
        expect(table!.findColumnByName("name")).to.be.undefined;
        expect(table!.findColumnByName("version")).to.be.undefined;
        if (true/*!(connection.driver instanceof CockroachDriver)*/) // TODO(uki00a) uncomment this when CockroachDriver is implemented.
            expect(table!.findColumnByName("id")).to.be.undefined;

        await queryRunner.executeMemoryDownSql();

        table = await queryRunner.getTable("post");
        table!.findColumnByName("id")!.should.be.exist;
        table!.findColumnByName("name")!.should.be.exist;
        table!.findColumnByName("version")!.should.be.exist;

        await queryRunner.release();
    })));

});

runIfMain(import.meta);
