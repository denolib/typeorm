import {runIfMain} from "../../deps/mocha.ts";
import "../../deps/chai.ts";
import {Connection} from "../../../src/connection/Connection.ts";
// TODO(uki00a) uncomment this when CockroachDriver is implemented.
// import {CockroachDriver} from "../../../src/driver/cockroachdb/CockroachDriver.ts";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils.ts";
import {Table} from "../../../src/schema-builder/table/Table.ts";
import {Book, Book2} from "./entity/Book.ts";
import {Faculty} from "./entity/Faculty.ts";
import {Photo} from "./entity/Photo.ts";
import {Post} from "./entity/Post.ts";
import {Student} from "./entity/Student.ts";
import {Teacher} from "./entity/Teacher.ts";

describe("query runner > create primary key", () => {

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

    it("should correctly create primary key and revert creation", () => Promise.all(connections.map(async connection => {

        // CockroachDB does not allow altering primary key
        if (false/*connection.driver instanceof CockroachDriver*/) // TODO(uki00a) uncomment this when CockroachDriver is implemented.
            return;

        const queryRunner = connection.createQueryRunner();
        await queryRunner.createTable(new Table({
            name: "category",
            columns: [
                {
                    name: "id",
                    type: "int",
                },
                {
                    name: "name",
                    type: "varchar",
                }
            ]
        }), true);

        await queryRunner.createTable(new Table({
            name: "person",
            columns: [
                {
                    name: "id",
                    type: "int",
                },
                {
                    name: "userId",
                    type: "int",
                },
                {
                    name: "name",
                    type: "varchar",
                }
            ]
        }), true);

        // clear sqls in memory to avoid removing tables when down queries executed.
        queryRunner.clearSqlMemory();

        await queryRunner.createPrimaryKey("category", ["id"]);
        await queryRunner.createPrimaryKey("person", ["id", "userId"]);

        let categoryTable = await queryRunner.getTable("category");
        categoryTable!.findColumnByName("id")!.isPrimary.should.be.true;

        let personTable = await queryRunner.getTable("person");
        personTable!.findColumnByName("id")!.isPrimary.should.be.true;
        personTable!.findColumnByName("userId")!.isPrimary.should.be.true;

        await queryRunner.executeMemoryDownSql();

        categoryTable = await queryRunner.getTable("category");
        categoryTable!.findColumnByName("id")!.isPrimary.should.be.false;

        personTable = await queryRunner.getTable("person");
        personTable!.findColumnByName("id")!.isPrimary.should.be.false;
        personTable!.findColumnByName("userId")!.isPrimary.should.be.false;

        await queryRunner.release();
    })));

});

runIfMain(import.meta);
