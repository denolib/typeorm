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

describe("query runner > create and drop database", () => {

    let connections: Connection[];
    before(async () => {
        connections = await createTestingConnections({
            entities: [Book, Book2, Faculty, Photo, Post, Student, Teacher],
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
