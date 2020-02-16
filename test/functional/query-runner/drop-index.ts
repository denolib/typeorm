import {join as joinPaths} from "../../../vendor/https/deno.land/std/path/mod.ts";
import {runIfMain} from "../../deps/mocha.ts";
import "../../deps/chai.ts";
import {Connection} from "../../../src/connection/Connection.ts";
// TODO(uki00a) uncomment this when CockroachDriver is implemented.
// import {CockroachDriver} from "../../../src/driver/cockroachdb/CockroachDriver.ts";
import {getDirnameOfCurrentModule, closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils.ts";

describe("query runner > drop index", () => {

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

    it("should correctly drop index and revert drop", () => Promise.all(connections.map(async connection => {

        const queryRunner = connection.createQueryRunner();

        let table = await queryRunner.getTable("student");
        // CockroachDB also stores indices for relation columns
        if (false/* connection.driver instanceof CockroachDriver */) { // TODO(uki00a) uncomment this when CockroachDriver is implemented.
            table!.indices.length.should.be.equal(3);
        } else {
            table!.indices.length.should.be.equal(1);
        }

        await queryRunner.dropIndex(table!, table!.indices[0]);

        table = await queryRunner.getTable("student");
        // CockroachDB also stores indices for relation columns
        if (false/* connection.driver instanceof CockroachDriver */) { // TODO(uki00a) uncomment this when CockroachDriver is implemented.
            table!.indices.length.should.be.equal(2);
        } else {
            table!.indices.length.should.be.equal(0);
        }

        await queryRunner.executeMemoryDownSql();

        table = await queryRunner.getTable("student");
        // CockroachDB also stores indices for relation columns
        if (false/* connection.driver instanceof CockroachDriver */) { // TODO(uki00a) uncomment this when CockroachDriver is implemented.
            table!.indices.length.should.be.equal(3);
        } else {
            table!.indices.length.should.be.equal(1);
        }

        await queryRunner.release();
    })));

});

runIfMain(import.meta);
