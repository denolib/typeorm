import "reflect-metadata";
import {Connection} from "../../../src";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../../test/utils/test-utils";

describe("query runner > drop table", () => {

    let connections: Connection[];
    beforeAll(async () => {
        connections = await createTestingConnections({
            entities: [__dirname + "/entity/*{.js,.ts}"],
            schemaCreate: true,
        });
    });
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("should correctly drop table without relations and revert drop", () => Promise.all(connections.map(async connection => {

        const queryRunner = connection.createQueryRunner();

        let table = await queryRunner.getTable("post");
        expect(table)!.toBeDefined();

        await queryRunner.dropTable("post");

        table = await queryRunner.getTable("post");
        expect(table).toBeUndefined();

        await queryRunner.executeMemoryDownSql();

        table = await queryRunner.getTable("post");
        expect(table)!.toBeDefined();

        await queryRunner.release();
    })));

    test("should correctly drop table with relations and revert drop", () => Promise.all(connections.map(async connection => {

        const queryRunner = connection.createQueryRunner();

        let studentTable = await queryRunner.getTable("student");
        let teacherTable = await queryRunner.getTable("teacher");
        let facultyTable = await queryRunner.getTable("faculty");
        expect(studentTable)!.toBeDefined();
        expect(teacherTable)!.toBeDefined();
        expect(facultyTable)!.toBeDefined();

        await queryRunner.dropTable(studentTable!);
        await queryRunner.dropTable(teacherTable!);
        await queryRunner.dropTable(facultyTable!);

        studentTable = await queryRunner.getTable("student");
        teacherTable = await queryRunner.getTable("teacher");
        facultyTable = await queryRunner.getTable("faculty");
        expect(studentTable).toBeUndefined();
        expect(teacherTable).toBeUndefined();
        expect(facultyTable).toBeUndefined();

        await queryRunner.executeMemoryDownSql();

        studentTable = await queryRunner.getTable("student");
        teacherTable = await queryRunner.getTable("teacher");
        facultyTable = await queryRunner.getTable("faculty");
        expect(studentTable)!.toBeDefined();
        expect(teacherTable)!.toBeDefined();
        expect(facultyTable)!.toBeDefined();

        await queryRunner.release();
    })));

});
