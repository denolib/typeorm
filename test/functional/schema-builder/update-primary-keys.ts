import {join as joinPaths} from "../../../vendor/https/deno.land/std/path/mod.ts";
import {runIfMain} from "../../deps/mocha.ts";
import "../../deps/chai.ts";
import {Connection} from "../../../src/connection/Connection.ts";
// TODO(uki00a) uncomment this when CockroachDriver is implemented.
// import {CockroachDriver} from "../../../src/driver/cockroachdb/CockroachDriver.ts";
import {getDirnameOfCurrentModule, closeTestingConnections, createTestingConnections} from "../../utils/test-utils.ts";
import {Category} from "./entity/Category.ts";
import {Question} from "./entity/Question.ts";
import {AbstractSqliteDriver} from "../../../src/driver/sqlite-abstract/AbstractSqliteDriver.ts";

describe("schema builder > update primary keys", () => {

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

    it("should correctly update composite primary keys", () => Promise.all(connections.map(async connection => {

        // CockroachDB does not support changing primary key constraint
        if (false/*connection.driver instanceof CockroachDriver*/) // TODO(uki00a) uncomment this when CockroachDriver is implemented.
            return;

        const metadata = connection.getMetadata(Category);
        const nameColumn = metadata.findColumnWithPropertyName("name");
        nameColumn!.isPrimary = true;

        await connection.synchronize();

        const queryRunner = connection.createQueryRunner();
        const table = await queryRunner.getTable("category");
        table!.findColumnByName("id")!.isPrimary.should.be.true;
        table!.findColumnByName("name")!.isPrimary.should.be.true;

        await queryRunner.release();
    })));

    it("should correctly update composite primary keys when table already have primary generated column", () => Promise.all(connections.map(async connection => {
        // Sqlite does not support AUTOINCREMENT on composite primary key
        if (connection.driver instanceof AbstractSqliteDriver)
            return;

        // CockroachDB does not support changing primary key constraint
        if (false/*connection.driver instanceof CockroachDriver*/) // TODO(uki00a) uncomment this when CockroachDriver is implemented.
            return;

        const metadata = connection.getMetadata(Question);
        const nameColumn = metadata.findColumnWithPropertyName("name");
        nameColumn!.isPrimary = true;

        await connection.synchronize();

        const queryRunner = connection.createQueryRunner();
        const table = await queryRunner.getTable("question");
        table!.findColumnByName("id")!.isPrimary.should.be.true;
        table!.findColumnByName("name")!.isPrimary.should.be.true;

        await queryRunner.release();
    })));

});

runIfMain(import.meta);
