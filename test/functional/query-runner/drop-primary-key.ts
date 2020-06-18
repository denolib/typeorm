import {runIfMain} from "../../deps/mocha.ts";
import "../../deps/chai.ts";
import {Connection} from "../../../src/connection/Connection.ts";
// TODO(uki00a) uncomment this when CockroachDriver is implemented.
// import {CockroachDriver} from "../../../src/driver/cockroachdb/CockroachDriver.ts";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils.ts";
import {Book, Book2} from "./entity/Book.ts";
import {Faculty} from "./entity/Faculty.ts";
import {Photo} from "./entity/Photo.ts";
import {Post} from "./entity/Post.ts";
import {Student} from "./entity/Student.ts";
import {Teacher} from "./entity/Teacher.ts";

describe("query runner > drop primary key", () => {

    let connections: Connection[];
    before(async () => {
        connections = await createTestingConnections({
            entities: [Book, Book2, Faculty, Photo, Post, Student, Teacher],
            schemaCreate: true,
            dropSchema: true,
        });
    });
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("should correctly drop primary key and revert drop", () => Promise.all(connections.map(async connection => {

        // CockroachDB does not allow dropping primary key
        if (false/* connection.driver instanceof CockroachDriver */) // TODO(uki00a) uncomment this when CockroachDriver is implemented.
            return;

        const queryRunner = connection.createQueryRunner();

        let table = await queryRunner.getTable("post");
        table!.findColumnByName("id")!.isPrimary.should.be.true;

        await queryRunner.dropPrimaryKey(table!);

        table = await queryRunner.getTable("post");
        table!.findColumnByName("id")!.isPrimary.should.be.false;

        await queryRunner.executeMemoryDownSql();

        table = await queryRunner.getTable("post");
        table!.findColumnByName("id")!.isPrimary.should.be.true;

        await queryRunner.release();
    })));

});

runIfMain(import.meta);
