import {runIfMain} from "../../deps/mocha.ts";
import "../../deps/chai.ts";
import {Connection} from "../../../src/connection/Connection.ts";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils.ts";
import {Book, Book2} from "./entity/Book.ts";
import {Faculty} from "./entity/Faculty.ts";
import {Photo} from "./entity/Photo.ts";
import {Post} from "./entity/Post.ts";
import {Student} from "./entity/Student.ts";
import {Teacher} from "./entity/Teacher.ts";

describe("query runner > drop unique constraint", () => {

    let connections: Connection[];
    before(async () => {
        connections = await createTestingConnections({
            entities: [Book, Book2, Faculty, Photo, Post, Student, Teacher],
            enabledDrivers: ["mssql", "postgres", "sqlite", "oracle", "cockroachdb"], // mysql and sap does not supports unique constraints
            schemaCreate: true,
            dropSchema: true,
        });
    });
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("should correctly drop unique constraint and revert drop", () => Promise.all(connections.map(async connection => {

        const queryRunner = connection.createQueryRunner();

        let table = await queryRunner.getTable("post");
        table!.uniques.length.should.be.equal(2);

        // find composite unique constraint to delete
        const unique = table!.uniques.find(u => u.columnNames.length === 2);
        await queryRunner.dropUniqueConstraint(table!, unique!);

        table = await queryRunner.getTable("post");
        table!.uniques.length.should.be.equal(1);

        await queryRunner.executeMemoryDownSql();

        table = await queryRunner.getTable("post");
        table!.uniques.length.should.be.equal(2);

        await queryRunner.release();
    })));

});

runIfMain(import.meta);
