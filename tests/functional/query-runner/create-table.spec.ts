import "reflect-metadata";
import {Connection} from "../../../src";
import {CockroachDriver} from "../../../src/driver/cockroachdb/CockroachDriver";
import {closeTestingConnections, createTestingConnections} from "../../utils/test-utils";
import {Table} from "../../../src";
import {TableOptions} from "../../../src/schema-builder/options/TableOptions";
import {Post} from "./entity/Post";
import {MysqlDriver} from "../../../src/driver/mysql/MysqlDriver";
import {AbstractSqliteDriver} from "../../../src/driver/sqlite-abstract/AbstractSqliteDriver";
import {OracleDriver} from "../../../src/driver/oracle/OracleDriver";
import {Photo} from "./entity/Photo";

describe("query runner > create table", () => {

    let connections: Connection[];
    beforeAll(async () => {
        connections = await createTestingConnections({
            entities: [__dirname + "/entity/*{.js,.ts}"],
            dropSchema: true,
        });
    });
    afterAll(() => closeTestingConnections(connections));

    test("should correctly create table from simple object and revert creation", () => Promise.all(connections.map(async connection => {

        const queryRunner = connection.createQueryRunner();
        const options: TableOptions = {
            name: "category",
            columns: [
                {
                    name: "id",
                    type: connection.driver instanceof AbstractSqliteDriver ? "integer" : "int",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: "increment"
                },
                {
                    name: "name",
                    type: "varchar",
                    isUnique: true,
                    isNullable: false
                }
            ]
        };

        await queryRunner.createTable(new Table(options), true);

        let table = await queryRunner.getTable("category");
        const idColumn = table!.findColumnByName("id");
        const nameColumn = table!.findColumnByName("name");
        expect(idColumn)!.toBeDefined();
        expect(idColumn!.isPrimary).toBeTruthy();
        expect(idColumn!.isGenerated).toBeTruthy();
        expect(idColumn!.generationStrategy)!.toEqual("increment");
        expect(nameColumn)!.toBeDefined();
        expect(nameColumn!.isUnique).toBeTruthy();
        expect(table)!.toBeDefined();
        if (!(connection.driver instanceof MysqlDriver))
            expect(table!.uniques.length).toEqual(1);

        await queryRunner.executeMemoryDownSql();
        table = await queryRunner.getTable("category");
        expect(table).toBeUndefined();

        await queryRunner.release();
    })));

    test("should correctly create table from Entity", () => Promise.all(connections.map(async connection => {

        const queryRunner = connection.createQueryRunner();
        const metadata = connection.getMetadata(Post);
        const newTable = Table.create(metadata, connection.driver);
        await queryRunner.createTable(newTable);

        const table = await queryRunner.getTable("post");
        const idColumn = table!.findColumnByName("id");
        const versionColumn = table!.findColumnByName("version");
        const nameColumn = table!.findColumnByName("name");
        expect(table)!.toBeDefined();
        if (!(connection.driver instanceof MysqlDriver)) {
            expect(table!.uniques.length).toEqual(2);
            expect(table!.checks.length).toEqual(1);
        }

        expect(idColumn!.isPrimary).toBeTruthy();
        expect(versionColumn!.isUnique).toBeTruthy();
        expect(nameColumn!.default)!.toBeDefined();

        await queryRunner.release();
    })));

    test("should correctly create table with all dependencies and revert creation", () => Promise.all(connections.map(async connection => {

        const queryRunner = connection.createQueryRunner();

        await queryRunner.createTable(new Table({
            name: "person",
            columns: [
                {
                    name: "id",
                    type: "int",
                    isPrimary: true
                },
                {
                    name: "userId",
                    type: "int",
                    isPrimary: true
                },
                {
                    name: "name",
                    type: "varchar",
                }
            ]
        }), true);

        const questionTableOptions = <TableOptions>{
            name: "question",
            columns: [
                {
                    name: "id",
                    type: connection.driver instanceof AbstractSqliteDriver ? "integer" : "int",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: "increment"
                },
                {
                    name: "name",
                    type: "varchar",
                },
                {
                    name: "text",
                    type: "varchar",
                    isNullable: false
                },
                {
                    name: "authorId",
                    type: "int"
                },
                {
                    name: "authorUserId",
                    type: "int"
                }
            ],
            indices: [{ columnNames: ["authorId", "authorUserId"], isUnique: true }],
            foreignKeys: [
                {
                    columnNames: ["authorId", "authorUserId"],
                    referencedTableName: "person",
                    referencedColumnNames: ["id", "userId"]
                }
            ]
        };

        if (connection.driver instanceof MysqlDriver) {
            questionTableOptions.indices!.push({ columnNames: ["name", "text"] });
        } else {
            questionTableOptions.uniques = [{ columnNames: ["name", "text"] }];
            questionTableOptions.checks = [{ expression: `${connection.driver.escape("name")} <> 'ASD'` }];
        }

        await queryRunner.createTable(new Table(questionTableOptions), true);

        const categoryTableOptions = <TableOptions>{
            name: "category",
            columns: [
                {
                    name: "id",
                    type: connection.driver instanceof AbstractSqliteDriver ? "integer" : "int",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: "increment"
                },
                {
                    name: "name",
                    type: "varchar",
                    default: "'default category'",
                    isUnique: true,
                    isNullable: false
                },
                {
                    name: "alternativeName",
                    type: "varchar",
                },
                {
                    name: "questionId",
                    type: "int",
                    isUnique: true
                }
            ],
            foreignKeys: [
                {
                    columnNames: ["questionId"],
                    referencedTableName: "question",
                    referencedColumnNames: ["id"]
                }
            ]
        };

        if (connection.driver instanceof MysqlDriver) {
            categoryTableOptions.indices = [{ columnNames: ["name", "alternativeName"]}];
        } else {
            categoryTableOptions.uniques = [{ columnNames: ["name", "alternativeName"]}];
        }

        // When we mark column as unique, MySql create index for that column and we don't need to create index separately.
        if (!(connection.driver instanceof MysqlDriver) && !(connection.driver instanceof OracleDriver))
            categoryTableOptions.indices = [{ columnNames: ["questionId"] }];

        await queryRunner.createTable(new Table(categoryTableOptions), true);

        let personTable = await queryRunner.getTable("person");
        const personIdColumn = personTable!.findColumnByName("id");
        const personUserIdColumn = personTable!.findColumnByName("id");
        expect(personIdColumn!.isPrimary).toBeTruthy();
        expect(personUserIdColumn!.isPrimary).toBeTruthy();
        expect(personTable)!.toBeDefined();

        let questionTable = await queryRunner.getTable("question");
        const questionIdColumn = questionTable!.findColumnByName("id");
        expect(questionIdColumn!.isPrimary).toBeTruthy();
        expect(questionIdColumn!.isGenerated).toBeTruthy();
        expect(questionIdColumn!.generationStrategy)!.toEqual("increment");
        expect(questionTable)!.toBeDefined();

        if (connection.driver instanceof MysqlDriver) {
            // MySql driver does not have unique and check constraints.
            // all unique constraints is unique indexes.
            expect(questionTable!.uniques.length).toEqual(0);
            expect(questionTable!.indices.length).toEqual(2);

        } else if (connection.driver instanceof CockroachDriver) {
            // CockroachDB stores unique indices as UNIQUE constraints
            expect(questionTable!.uniques.length).toEqual(2);
            expect(questionTable!.uniques[0].columnNames.length).toEqual(2);
            expect(questionTable!.uniques[1].columnNames.length).toEqual(2);
            expect(questionTable!.indices.length).toEqual(0);
            expect(questionTable!.checks.length).toEqual(1);

        } else {
            expect(questionTable!.uniques.length).toEqual(1);
            expect(questionTable!.uniques[0].columnNames.length).toEqual(2);
            expect(questionTable!.indices.length).toEqual(1);
            expect(questionTable!.indices[0].columnNames.length).toEqual(2);
            expect(questionTable!.checks.length).toEqual(1);
        }

        expect(questionTable!.foreignKeys.length).toEqual(1);
        expect(questionTable!.foreignKeys[0].columnNames.length).toEqual(2);
        expect(questionTable!.foreignKeys[0].referencedColumnNames.length).toEqual(2);

        let categoryTable = await queryRunner.getTable("category");
        const categoryTableIdColumn = categoryTable!.findColumnByName("id");
        expect(categoryTableIdColumn!.isPrimary).toBeTruthy();
        expect(categoryTableIdColumn!.isGenerated).toBeTruthy();
        expect(categoryTableIdColumn!.generationStrategy)!.toEqual("increment");
        expect(categoryTable)!.toBeDefined();
        expect(categoryTable!.foreignKeys.length).toEqual(1);

        if (connection.driver instanceof MysqlDriver) {
            // MySql driver does not have unique constraints. All unique constraints is unique indexes.
            expect(categoryTable!.indices.length).toEqual(3);

        } else if (connection.driver instanceof OracleDriver) {
            // Oracle does not allow to put index on primary or unique columns.
            expect(categoryTable!.indices.length).toEqual(0);

        } else {
            expect(categoryTable!.uniques.length).toEqual(3);
            expect(categoryTable!.indices.length).toEqual(1);
        }

        await queryRunner.executeMemoryDownSql();

        questionTable = await queryRunner.getTable("question");
        categoryTable = await queryRunner.getTable("category");
        personTable = await queryRunner.getTable("person");
        expect(questionTable).toBeUndefined();
        expect(categoryTable).toBeUndefined();
        expect(personTable).toBeUndefined();

        await queryRunner.release();
    })));

    test("should correctly create table with different `Unique` definitions", () => Promise.all(connections.map(async connection => {

        const queryRunner = connection.createQueryRunner();
        const metadata = connection.getMetadata(Photo);
        const newTable = Table.create(metadata, connection.driver);
        await queryRunner.createTable(newTable);

        let table = await queryRunner.getTable("photo");
        const nameColumn = table!.findColumnByName("name");
        const tagColumn = table!.findColumnByName("tag");
        const descriptionColumn = table!.findColumnByName("description");
        const textColumn = table!.findColumnByName("text");

        expect(table)!.toBeDefined();
        expect(nameColumn!.isUnique).toBeTruthy();
        expect(descriptionColumn!.isUnique).toBeTruthy();

        if (connection.driver instanceof MysqlDriver) {
            expect(table!.uniques.length).toEqual(0);
            expect(table!.indices.length).toEqual(4);
            expect(tagColumn!.isUnique).toBeTruthy();
            expect(textColumn!.isUnique).toBeTruthy();

        } else if (connection.driver instanceof CockroachDriver) {
            // CockroachDB stores unique indices as UNIQUE constraints
            expect(table!.uniques.length).toEqual(4);
            expect(table!.indices.length).toEqual(0);
            expect(tagColumn!.isUnique).toBeTruthy();
            expect(textColumn!.isUnique).toBeTruthy();

        } else {
            expect(table!.uniques.length).toEqual(2);
            expect(table!.indices.length).toEqual(2);
            expect(tagColumn!.isUnique).toBeFalsy();
            expect(textColumn!.isUnique).toBeFalsy();
        }

        await queryRunner.executeMemoryDownSql();

        table = await queryRunner.getTable("photo");
        expect(table).toBeUndefined();

        await queryRunner.release();
    })));

});
