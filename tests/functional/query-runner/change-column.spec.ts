import "reflect-metadata";
import {Connection} from "../../../src";
import {CockroachDriver} from "../../../src/driver/cockroachdb/CockroachDriver";
import {closeTestingConnections, createTestingConnections} from "../../utils/test-utils";
import {AbstractSqliteDriver} from "../../../src/driver/sqlite-abstract/AbstractSqliteDriver";

describe("query runner > change column", () => {

    let connections: Connection[];
    beforeAll(async () => {
        connections = await createTestingConnections({
            entities: [__dirname + "/entity/*{.js,.ts}"],
            schemaCreate: true,
            dropSchema: true,
        });
    });
    afterAll(() => closeTestingConnections(connections));

    test("should correctly change column and revert change", () => Promise.all(connections.map(async connection => {

        // CockroachDB does not allow changing primary columns and renaming constraints
        if (connection.driver instanceof CockroachDriver)
            return;

        const queryRunner = connection.createQueryRunner();
        let table = await queryRunner.getTable("post");

        const nameColumn = table!.findColumnByName("name")!;
        expect(nameColumn!.default)!.toBeDefined();
        expect(nameColumn!.isUnique).toBeFalsy();

        const changedNameColumn = nameColumn.clone();
        changedNameColumn.default = undefined;
        changedNameColumn.isUnique = true;
        changedNameColumn.isNullable = true;
        changedNameColumn.length = "500";
        await queryRunner.changeColumn(table!, nameColumn, changedNameColumn);

        table = await queryRunner.getTable("post");
        expect(table!.findColumnByName("name")!.default).toBeUndefined();
        expect(table!.findColumnByName("name")!.isUnique).toBeTruthy();
        expect(table!.findColumnByName("name")!.isNullable).toBeTruthy();

        // SQLite does not impose any length restrictions
        if (!(connection.driver instanceof AbstractSqliteDriver))
            expect(table!.findColumnByName("name")!.length)!.toEqual("500");

        const textColumn = table!.findColumnByName("text")!;
        const changedTextColumn = textColumn.clone();
        changedTextColumn.name = "description";
        changedTextColumn.isPrimary = true;
        changedTextColumn.default = "'default text'";
        await queryRunner.changeColumn(table!, textColumn, changedTextColumn);

        // column name was changed to 'description'
        table = await queryRunner.getTable("post");
        expect(table!.findColumnByName("description")!.isPrimary).toBeTruthy();
        expect(table!.findColumnByName("description")!.default)!.toBeDefined();

        let idColumn = table!.findColumnByName("id")!;
        let changedIdColumn = idColumn.clone();
        changedIdColumn!.isPrimary = false;
        await queryRunner.changeColumn(table!, idColumn, changedIdColumn);

        table = await queryRunner.getTable("post");
        expect(table!.findColumnByName("id")!.isPrimary).toBeFalsy();

        await queryRunner.executeMemoryDownSql();

        table = await queryRunner.getTable("post");
        expect(table!.findColumnByName("id")!.isPrimary).toBeTruthy();
        expect(table!.findColumnByName("name")!.default)!.toBeDefined();
        expect(table!.findColumnByName("name")!.isUnique).toBeFalsy();
        expect(table!.findColumnByName("name")!.isNullable).toBeFalsy();
        expect(table!.findColumnByName("text")!.isPrimary).toBeFalsy();
        expect(table!.findColumnByName("text")!.default).toBeUndefined();

        await queryRunner.release();
    })));

    test("should correctly change column 'isGenerated' property and revert change", () => Promise.all(connections.map(async connection => {

        // CockroachDB does not allow changing generated columns in existent tables
        if (connection.driver instanceof CockroachDriver)
            return;

        const queryRunner = connection.createQueryRunner();
        let table = await queryRunner.getTable("post");
        let idColumn = table!.findColumnByName("id")!;
        let changedIdColumn = idColumn.clone();

        changedIdColumn.isGenerated = true;
        changedIdColumn.generationStrategy = "increment";
        await queryRunner.changeColumn(table!, idColumn, changedIdColumn);

        table = await queryRunner.getTable("post");
        expect(table!.findColumnByName("id")!.isGenerated).toBeTruthy();
        expect(table!.findColumnByName("id")!.generationStrategy)!.toEqual("increment");

        await queryRunner.executeMemoryDownSql();
        queryRunner.clearSqlMemory();

        table = await queryRunner.getTable("post");
        expect(table!.findColumnByName("id")!.isGenerated).toBeFalsy();
        expect(table!.findColumnByName("id")!.generationStrategy).toBeUndefined();

        table = await queryRunner.getTable("post");
        idColumn = table!.findColumnByName("id")!;
        changedIdColumn = idColumn.clone();
        changedIdColumn.isPrimary = false;
        await queryRunner.changeColumn(table!, idColumn, changedIdColumn);

        // check case when both primary and generated properties set to true
        table = await queryRunner.getTable("post");
        idColumn = table!.findColumnByName("id")!;
        changedIdColumn = idColumn.clone();
        changedIdColumn.isPrimary = true;
        changedIdColumn.isGenerated = true;
        changedIdColumn.generationStrategy = "increment";
        await queryRunner.changeColumn(table!, idColumn, changedIdColumn);

        table = await queryRunner.getTable("post");
        expect(table!.findColumnByName("id")!.isGenerated).toBeTruthy();
        expect(table!.findColumnByName("id")!.generationStrategy)!.toEqual("increment");

        await queryRunner.executeMemoryDownSql();
        queryRunner.clearSqlMemory();

        table = await queryRunner.getTable("post");
        expect(table!.findColumnByName("id")!.isGenerated).toBeFalsy();
        expect(table!.findColumnByName("id")!.generationStrategy).toBeUndefined();

        await queryRunner.release();

    })));

});
