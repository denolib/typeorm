import "reflect-metadata";
import {Connection} from "../../../src";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../../test/utils/test-utils";
import {PromiseUtils} from "../../../src";
import {Teacher} from "./entity/Teacher";
import {UniqueMetadata} from "../../../src/metadata/UniqueMetadata";
import {MysqlDriver} from "../../../src/driver/mysql/MysqlDriver";
import {Post} from "./entity/Post";
import {AbstractSqliteDriver} from "../../../src/driver/sqlite-abstract/AbstractSqliteDriver";
import {IndexMetadata} from "../../../src/metadata/IndexMetadata";

describe("schema builder > change unique constraint", () => {

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

    test("should correctly add new unique constraint", () => PromiseUtils.runInSequence(connections, async connection => {
        const teacherMetadata = connection.getMetadata(Teacher);
        const nameColumn = teacherMetadata.findColumnWithPropertyName("name")!;
        let uniqueIndexMetadata: IndexMetadata|undefined = undefined;
        let uniqueMetadata: UniqueMetadata|undefined = undefined;

        // Mysql stores unique constraints as unique indices.
        if (connection.driver instanceof MysqlDriver) {
            uniqueIndexMetadata = new IndexMetadata({
                entityMetadata: teacherMetadata,
                columns: [nameColumn],
                args: {
                    target: Teacher,
                    unique: true,
                    synchronize: true
                }
            });
            uniqueIndexMetadata.build(connection.namingStrategy);
            teacherMetadata.indices.push(uniqueIndexMetadata);

        } else {
            uniqueMetadata = new UniqueMetadata({
                entityMetadata: teacherMetadata,
                columns: [nameColumn],
                args: {
                    target: Teacher
                }
            });
            uniqueMetadata.build(connection.namingStrategy);
            teacherMetadata.uniques.push(uniqueMetadata);
        }

        await connection.synchronize();

        const queryRunner = connection.createQueryRunner();
        const table = await queryRunner.getTable("teacher");
        await queryRunner.release();

        if (connection.driver instanceof MysqlDriver) {
            expect(table!.indices.length).toEqual(1);
            expect(table!.indices[0].isUnique)!.toBeTruthy();

            // revert changes
            teacherMetadata.indices.splice(teacherMetadata.indices.indexOf(uniqueIndexMetadata!), 1);

        } else {
            expect(table!.uniques.length).toEqual(1);

            // revert changes
            teacherMetadata.uniques.splice(teacherMetadata.uniques.indexOf(uniqueMetadata!), 1);
        }
    }));

    it("should correctly change unique constraint", () => PromiseUtils.runInSequence(connections, async connection => {
        // Sqlite does not store unique constraint name
        if (connection.driver instanceof AbstractSqliteDriver)
            return;

        const postMetadata = connection.getMetadata(Post);

        // Mysql stores unique constraints as unique indices.
        if (connection.driver instanceof MysqlDriver) {
            const uniqueIndexMetadata = postMetadata.indices.find(i => i.columns.length === 2 && i.isUnique === true);
            uniqueIndexMetadata!.name = "changed_unique";

        } else {
            const uniqueMetadata = postMetadata.uniques.find(uq => uq.columns.length === 2);
            uniqueMetadata!.name = "changed_unique";
        }

        await connection.synchronize();

        const queryRunner = connection.createQueryRunner();
        const table = await queryRunner.getTable("post");
        await queryRunner.release();

        if (connection.driver instanceof MysqlDriver) {
            const tableIndex = table!.indices.find(index => index.columnNames.length === 2 && index.isUnique === true);
            expect(tableIndex!.name)!.toEqual("changed_unique");

            // revert changes
            const uniqueIndexMetadata = postMetadata.indices.find(i => i.name === "changed_unique");
            uniqueIndexMetadata!.name = connection.namingStrategy.indexName(table!, uniqueIndexMetadata!.columns.map(c => c.databaseName));

        } else {
            const tableUnique = table!.uniques.find(unique => unique.columnNames.length === 2);
            expect(tableUnique!.name)!.toEqual("changed_unique");

            // revert changes
            const uniqueMetadata = postMetadata.uniques.find(i => i.name === "changed_unique");
            uniqueMetadata!.name = connection.namingStrategy.uniqueConstraintName(table!, uniqueMetadata!.columns.map(c => c.databaseName));
        }

    }));

    test("should correctly drop removed unique constraint", () => PromiseUtils.runInSequence(connections, async connection => {
        const postMetadata = connection.getMetadata(Post);

        // Mysql stores unique constraints as unique indices.
        if (connection.driver instanceof MysqlDriver) {
            const index = postMetadata!.indices.find(i => i.columns.length === 2 && i.isUnique === true);
            postMetadata!.indices.splice(postMetadata!.indices.indexOf(index!), 1);

        } else  {
            const unique = postMetadata!.uniques.find(u => u.columns.length === 2);
            postMetadata!.uniques.splice(postMetadata!.uniques.indexOf(unique!), 1);
        }

        await connection.synchronize();

        const queryRunner = connection.createQueryRunner();
        const table = await queryRunner.getTable("post");
        await queryRunner.release();

        if (connection.driver instanceof MysqlDriver) {
            expect(table!.indices.length).toEqual(1);

        } else {
            expect(table!.uniques.length).toEqual(1);
        }
    }));

});
