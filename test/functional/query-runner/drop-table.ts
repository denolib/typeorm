import {runIfMain} from "../../deps/mocha.ts";
import {expect} from "../../deps/chai.ts";
import {Connection} from "../../../src/connection/Connection.ts";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils.ts";
import {Book, Book2} from "./entity/Book.ts";
import {Faculty} from "./entity/Faculty.ts";
import {Photo} from "./entity/Photo.ts";
import {Post} from "./entity/Post.ts";
import {Student} from "./entity/Student.ts";
import {Teacher} from "./entity/Teacher.ts";

describe("query runner > drop table", () => {

    let connections: Connection[];
    before(async () => {
        connections = await createTestingConnections({
            entities: [Book, Book2, Faculty, Photo, Post, Student, Teacher],
            schemaCreate: true,
        });
    });
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("should correctly drop table without relations and revert drop", () => Promise.all(connections.map(async connection => {

        const queryRunner = connection.createQueryRunner();

        let table = await queryRunner.getTable("post");
        table!.should.exist;

        await queryRunner.dropTable("post");

        table = await queryRunner.getTable("post");
        expect(table).to.be.undefined;

        await queryRunner.executeMemoryDownSql();

        table = await queryRunner.getTable("post");
        table!.should.exist;

        await queryRunner.release();
    })));

    it("should correctly drop table with relations and revert drop", () => Promise.all(connections.map(async connection => {

        const queryRunner = connection.createQueryRunner();

        let studentTable = await queryRunner.getTable("student");
        let teacherTable = await queryRunner.getTable("teacher");
        let facultyTable = await queryRunner.getTable("faculty");
        studentTable!.should.exist;
        teacherTable!.should.exist;
        facultyTable!.should.exist;

        await queryRunner.dropTable(studentTable!);
        await queryRunner.dropTable(teacherTable!);
        await queryRunner.dropTable(facultyTable!);

        studentTable = await queryRunner.getTable("student");
        teacherTable = await queryRunner.getTable("teacher");
        facultyTable = await queryRunner.getTable("faculty");
        expect(studentTable).to.be.undefined;
        expect(teacherTable).to.be.undefined;
        expect(facultyTable).to.be.undefined;

        await queryRunner.executeMemoryDownSql();

        studentTable = await queryRunner.getTable("student");
        teacherTable = await queryRunner.getTable("teacher");
        facultyTable = await queryRunner.getTable("faculty");
        studentTable!.should.exist;
        teacherTable!.should.exist;
        facultyTable!.should.exist;

        await queryRunner.release();
    })));

});

runIfMain(import.meta);
