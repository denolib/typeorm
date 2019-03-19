import "reflect-metadata";
import {Connection} from "../../../src";
import {CockroachDriver} from "../../../src/driver/cockroachdb/CockroachDriver";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils";
import {PromiseUtils} from "../../../src";
import {AbstractSqliteDriver} from "../../../src/driver/sqlite-abstract/AbstractSqliteDriver";
import {PostgresDriver} from "../../../src/driver/postgres/PostgresDriver";
import {SqlServerDriver} from "../../../src/driver/sqlserver/SqlServerDriver";
import {Post} from "./entity/Post";
import {PostVersion} from "./entity/PostVersion";
import {MysqlDriver} from "../../../src/driver/mysql/MysqlDriver";
import {OracleDriver} from "../../../src/driver/oracle/OracleDriver";

describe("schema builder > change column", () => {

    let connections: Connection[];
    beforeAll(async () => {
        connections = await createTestingConnections({
            entities: [__dirname + "/entity/*{.js,.ts}"],
            schemaCreate: true,
            dropSchema: true,
        });
    });
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("should correctly change column name", () => PromiseUtils.runInSequence(connections, async connection => {
        const postMetadata = connection.getMetadata(Post);
        const nameColumn = postMetadata.findColumnWithPropertyName("name")!;
        nameColumn.propertyName = "title";
        nameColumn.build(connection);

        await connection.synchronize();

        const queryRunner = connection.createQueryRunner();
        const postTable = await queryRunner.getTable("post");
        await queryRunner.release();

        expect(postTable!.findColumnByName("name")).toBeUndefined();
        expect(postTable!.findColumnByName("title"))!.toBeDefined();

        // revert changes
        nameColumn.propertyName = "name";
        nameColumn.build(connection);
    }));

    test("should correctly change column length", () => PromiseUtils.runInSequence(connections, async connection => {
        const postMetadata = connection.getMetadata(Post);
        const nameColumn = postMetadata.findColumnWithPropertyName("name")!;
        const textColumn = postMetadata.findColumnWithPropertyName("text")!;
        nameColumn.length = "500";
        textColumn.length = "300";

        await connection.synchronize();

        const queryRunner = connection.createQueryRunner();
        const postTable = await queryRunner.getTable("post");
        await queryRunner.release();

        expect(postTable!.findColumnByName("name")!.length).toEqual("500");
        expect(postTable!.findColumnByName("text")!.length).toEqual("300");

        if (connection.driver instanceof MysqlDriver) {
            expect(postTable!.indices.length).toEqual(2);
        } else {
            expect(postTable!.uniques.length).toEqual(2);
        }

        // revert changes
        nameColumn.length = "255";
        textColumn.length = "255";
    }));

    test("should correctly change column type", () => PromiseUtils.runInSequence(connections, async connection => {

        // TODO: https://github.com/cockroachdb/cockroach/issues/34710
        if (connection.driver instanceof CockroachDriver)
            return;

        const postMetadata = connection.getMetadata(Post);
        const versionColumn = postMetadata.findColumnWithPropertyName("version")!;
        versionColumn.type = "int";

        // in test we must manually change referenced column too, but in real sync, it changes automatically
        const postVersionMetadata = connection.getMetadata(PostVersion);
        const postVersionColumn = postVersionMetadata.findColumnWithPropertyName("post")!;
        postVersionColumn.type = "int";

        await connection.synchronize();

        const queryRunner = connection.createQueryRunner();
        const postVersionTable = await queryRunner.getTable("post_version");
        await queryRunner.release();

        expect(postVersionTable!.foreignKeys.length).toEqual(1);

        // revert changes
        versionColumn.type = "varchar";
        postVersionColumn.type = "varchar";
    }));

    test("should correctly make column primary and generated", () => PromiseUtils.runInSequence(connections, async connection => {
        // CockroachDB does not allow changing PK
        if (connection.driver instanceof CockroachDriver)
            return;

        const postMetadata = connection.getMetadata(Post);
        const idColumn = postMetadata.findColumnWithPropertyName("id")!;
        const versionColumn = postMetadata.findColumnWithPropertyName("version")!;
        idColumn.isGenerated = true;
        idColumn.generationStrategy = "increment";

        // SQLite does not support AUTOINCREMENT with composite primary keys
        // Oracle does not support both unique and primary attributes on such column
        if (!(connection.driver instanceof AbstractSqliteDriver) && !(connection.driver instanceof OracleDriver))
            versionColumn.isPrimary = true;

        await connection.synchronize();

        const queryRunner = connection.createQueryRunner();
        const postTable = await queryRunner.getTable("post");
        await queryRunner.release();

        expect(postTable!.findColumnByName("id")!.isGenerated).toBeTruthy();
        expect(postTable!.findColumnByName("id")!.generationStrategy)!.toEqual("increment");

        // SQLite does not support AUTOINCREMENT with composite primary keys
        if (!(connection.driver instanceof AbstractSqliteDriver) && !(connection.driver instanceof OracleDriver))
            expect(postTable!.findColumnByName("version")!.isPrimary).toBeTruthy();

        // revert changes
        idColumn.isGenerated = false;
        idColumn.generationStrategy = undefined;
        versionColumn.isPrimary = false;
    }));

    test("should correctly change column `isGenerated` property when column is on foreign key", () => PromiseUtils.runInSequence(connections, async connection => {
        const teacherMetadata = connection.getMetadata("teacher");
        const idColumn = teacherMetadata.findColumnWithPropertyName("id")!;
        idColumn.isGenerated = false;
        idColumn.generationStrategy = undefined;

        await connection.synchronize();

        const queryRunner = connection.createQueryRunner();
        const teacherTable = await queryRunner.getTable("teacher");
        await queryRunner.release();

        expect(teacherTable!.findColumnByName("id")!.isGenerated).toBeFalsy();
        expect(teacherTable!.findColumnByName("id")!.generationStrategy).toBeUndefined();

        // revert changes
        idColumn.isGenerated = true;
        idColumn.generationStrategy = "increment";

    }));

    test("should correctly change non-generated column on to uuid-generated column", () => PromiseUtils.runInSequence(connections, async connection => {
        // CockroachDB does not allow changing PK
        if (connection.driver instanceof CockroachDriver)
            return;

        const queryRunner = connection.createQueryRunner();

        if (connection.driver instanceof PostgresDriver)
            await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

        const postMetadata = connection.getMetadata(Post);
        const idColumn = postMetadata.findColumnWithPropertyName("id")!;
        idColumn.isGenerated = true;
        idColumn.generationStrategy = "uuid";

        // depending on driver, we must change column and referenced column types
        if (connection.driver instanceof PostgresDriver || connection.driver instanceof CockroachDriver) {
            idColumn.type = "uuid";
        } else if (connection.driver instanceof SqlServerDriver) {
            idColumn.type = "uniqueidentifier";
        } else {
            idColumn.type = "varchar";
        }

        await connection.synchronize();

        const postTable = await queryRunner.getTable("post");
        await queryRunner.release();

        if (connection.driver instanceof PostgresDriver || connection.driver instanceof SqlServerDriver || connection.driver instanceof CockroachDriver) {
            expect(postTable!.findColumnByName("id")!.isGenerated).toBeTruthy();
            expect(postTable!.findColumnByName("id")!.generationStrategy)!.toEqual("uuid");

        } else {
            // other driver does not natively supports uuid type
            expect(postTable!.findColumnByName("id")!.isGenerated).toBeFalsy();
            expect(postTable!.findColumnByName("id")!.generationStrategy).toBeUndefined();
        }

        // revert changes
        idColumn.isGenerated = false;
        idColumn.generationStrategy = undefined;
        idColumn.type = "int";
        postMetadata.generatedColumns.splice(postMetadata.generatedColumns.indexOf(idColumn), 1);
        postMetadata.hasUUIDGeneratedColumns = false;

    }));

    test("should correctly change generated column generation strategy", () => PromiseUtils.runInSequence(connections, async connection => {
        // CockroachDB does not allow changing PK
        if (connection.driver instanceof CockroachDriver)
            return;

        const teacherMetadata = connection.getMetadata("teacher");
        const studentMetadata = connection.getMetadata("student");
        const idColumn = teacherMetadata.findColumnWithPropertyName("id")!;
        const teacherColumn = studentMetadata.findColumnWithPropertyName("teacher")!;
        idColumn.generationStrategy = "uuid";

        // depending on driver, we must change column and referenced column types
        if (connection.driver instanceof PostgresDriver || connection.driver instanceof CockroachDriver) {
            idColumn.type = "uuid";
            teacherColumn.type = "uuid";
        } else if (connection.driver instanceof SqlServerDriver) {
            idColumn.type = "uniqueidentifier";
            teacherColumn.type = "uniqueidentifier";
        } else {
            idColumn.type = "varchar";
            teacherColumn.type = "varchar";
        }

        await connection.synchronize();

        const queryRunner = connection.createQueryRunner();
        const teacherTable = await queryRunner.getTable("teacher");
        await queryRunner.release();

        if (connection.driver instanceof PostgresDriver || connection.driver instanceof SqlServerDriver) {
            expect(teacherTable!.findColumnByName("id")!.isGenerated).toBeTruthy();
            expect(teacherTable!.findColumnByName("id")!.generationStrategy)!.toEqual("uuid");

        } else {
            // other driver does not natively supports uuid type
            expect(teacherTable!.findColumnByName("id")!.isGenerated).toBeFalsy();
            expect(teacherTable!.findColumnByName("id")!.generationStrategy).toBeUndefined();
        }

        // revert changes
        idColumn.isGenerated = true;
        idColumn.generationStrategy = "increment";
        idColumn.type = "int";
        teacherColumn.type = "int";

    }));

});
