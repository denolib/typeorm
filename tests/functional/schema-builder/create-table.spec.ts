import "reflect-metadata";
import {Connection} from "../../../src";
import {CockroachDriver} from "../../../src/driver/cockroachdb/CockroachDriver";
import {closeTestingConnections, createTestingConnections} from "../../../test/utils/test-utils";
import {MysqlDriver} from "../../../src/driver/mysql/MysqlDriver";

describe("schema builder > create table", () => {

    let connections: Connection[];
    beforeAll(async () => {
        connections = await createTestingConnections({
            entities: [__dirname + "/entity/*{.js,.ts}"],
            dropSchema: true,
        });
    });
    afterAll(() => closeTestingConnections(connections));

    test("should correctly create tables with all dependencies", () => Promise.all(connections.map(async connection => {

        const queryRunner = connection.createQueryRunner();
        let postTable = await queryRunner.getTable("post");
        let teacherTable = await queryRunner.getTable("teacher");
        let studentTable = await queryRunner.getTable("student");
        let facultyTable = await queryRunner.getTable("faculty");
        expect(postTable).toBeUndefined();
        expect(teacherTable).toBeUndefined();
        expect(studentTable).toBeUndefined();
        expect(facultyTable).toBeUndefined();

        await connection.synchronize();

        postTable = await queryRunner.getTable("post");
        const idColumn = postTable!.findColumnByName("id");
        const versionColumn = postTable!.findColumnByName("version");
        const nameColumn = postTable!.findColumnByName("name");
        expect(postTable)!.toBeDefined();

        if (connection.driver instanceof MysqlDriver) {
            expect(postTable!.indices.length).toEqual(2);
        } else {
            expect(postTable!.uniques.length).toEqual(2);
            expect(postTable!.checks.length).toEqual(1);
        }

        expect(idColumn!.isPrimary).toBeTruthy();
        expect(versionColumn!.isUnique).toBeTruthy();
        expect(nameColumn!.default)!.toBeDefined();

        teacherTable = await queryRunner.getTable("teacher");
        expect(teacherTable)!.toBeDefined();

        studentTable = await queryRunner.getTable("student");
        expect(studentTable)!.toBeDefined();
        expect(studentTable!.foreignKeys.length).toEqual(2);
        // CockroachDB also stores indices for relation columns
        if (connection.driver instanceof CockroachDriver) {
            expect(studentTable!.indices.length).toEqual(3);
        } else {
            expect(studentTable!.indices.length).toEqual(1);
        }

        facultyTable = await queryRunner.getTable("faculty");
        expect(facultyTable)!.toBeDefined();

        await queryRunner.release();
    })));

});
