import {join as joinPaths} from "../../../vendor/https/deno.land/std/path/mod.ts";
import {runIfMain} from "../../deps/mocha.ts";
import {expect} from "../../deps/chai.ts";
import {Connection} from "../../../src/connection/Connection.ts";
import {getDirnameOfCurrentModule, closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils.ts";

describe("query runner > drop table", () => {

    let connections: Connection[];
    const __dirname = getDirnameOfCurrentModule(import.meta);
    before(async () => {
        connections = await createTestingConnections({
            entities: [joinPaths(__dirname, "/entity/*.ts")],
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
