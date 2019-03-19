import "reflect-metadata";
import {Connection} from "../../../src";
import {CockroachDriver} from "../../../src/driver/cockroachdb/CockroachDriver";
import {closeTestingConnections, createTestingConnections} from "../../utils/test-utils";

describe("query runner > drop column", () => {

    let connections: Connection[];
    beforeAll(async () => {
        connections = await createTestingConnections({
            entities: [__dirname + "/entity/*{.js,.ts}"],
            schemaCreate: true,
            dropSchema: true,
        });
    });
    afterAll(() => closeTestingConnections(connections));

    test("should correctly drop column and revert drop", () => Promise.all(connections.map(async connection => {

        const queryRunner = connection.createQueryRunner();

        let table = await queryRunner.getTable("post");
        const idColumn = table!.findColumnByName("id")!;
        const nameColumn = table!.findColumnByName("name")!;
        const versionColumn = table!.findColumnByName("version")!;
        expect(idColumn)!.toBeDefined();
        expect(nameColumn)!.toBeDefined();
        expect(versionColumn)!.toBeDefined();

        // In Sqlite 'dropColumns' method is more optimal than 'dropColumn', because it recreate table just once,
        // without all removed columns. In other drivers it's no difference between these methods, because 'dropColumns'
        // calls 'dropColumn' method for each removed column.
        // CockroachDB does not support changing pk.
        if (connection.driver instanceof CockroachDriver) {
            await queryRunner.dropColumns(table!, [nameColumn, versionColumn]);
        } else {
            await queryRunner.dropColumns(table!, [idColumn, nameColumn, versionColumn]);
        }

        table = await queryRunner.getTable("post");
        expect(table!.findColumnByName("name")).toBeUndefined();
        expect(table!.findColumnByName("version")).toBeUndefined();
        if (!(connection.driver instanceof CockroachDriver))
            expect(table!.findColumnByName("id")).toBeUndefined();

        await queryRunner.executeMemoryDownSql();

        table = await queryRunner.getTable("post");
        expect(table!.findColumnByName("id"))!.toBeDefined();
        expect(table!.findColumnByName("name"))!.toBeDefined();
        expect(table!.findColumnByName("version"))!.toBeDefined();

        await queryRunner.release();
    })));

});
