import "reflect-metadata";
import {Connection} from "../../../src";
import {CockroachDriver} from "../../../src/driver/cockroachdb/CockroachDriver";
import {closeTestingConnections, createTestingConnections} from "../../../test/utils/test-utils";
import {TableColumn} from "../../../src";
import {AbstractSqliteDriver} from "../../../src/driver/sqlite-abstract/AbstractSqliteDriver";
import {MysqlDriver} from "../../../src/driver/mysql/MysqlDriver";

describe("query runner > add column", () => {

    let connections: Connection[];
    beforeAll(async () => {
        connections = await createTestingConnections({
            entities: [__dirname + "/entity/*{.js,.ts}"],
            schemaCreate: true,
            dropSchema: true,
        });
    });
    afterAll(() => closeTestingConnections(connections));

    test("should correctly add column and revert add", () => Promise.all(connections.map(async connection => {

        const queryRunner = connection.createQueryRunner();

        let table = await queryRunner.getTable("post");
        let column1 = new TableColumn({
            name: "secondId",
            type: "int",
            isUnique: true,
            isNullable: false
        });

        // CockroachDB does not support altering primary key constraint
        if (!(connection.driver instanceof CockroachDriver))
            column1.isPrimary = true;

        // MySql and Sqlite does not supports autoincrement composite primary keys.
        if (!(connection.driver instanceof MysqlDriver) && !(connection.driver instanceof AbstractSqliteDriver) && !(connection.driver instanceof CockroachDriver)) {
            column1.isGenerated = true;
            column1.generationStrategy = "increment";
        }

        let column2 = new TableColumn({
            name: "description",
            type: "varchar",
            length: "100",
            default: "'this is description'"
        });

        await queryRunner.addColumn(table!, column1);
        await queryRunner.addColumn("post", column2);

        table = await queryRunner.getTable("post");
        column1 = table!.findColumnByName("secondId")!;
        expect(column1)!.toBeDefined();
        expect(column1!.isUnique).toBeTruthy();
        expect(column1!.isNullable).toBeFalsy();

        // CockroachDB does not support altering primary key constraint
        if (!(connection.driver instanceof CockroachDriver))
            expect(column1!.isPrimary).toBeTruthy();

        // MySql and Sqlite does not supports autoincrement composite primary keys.
        if (!(connection.driver instanceof MysqlDriver) && !(connection.driver instanceof AbstractSqliteDriver) && !(connection.driver instanceof CockroachDriver)) {
            expect(column1!.isGenerated).toBeTruthy();
            expect(column1!.generationStrategy)!.toEqual("increment");
        }

        column2 = table!.findColumnByName("description")!;
        expect(column2).toBeDefined();
        expect(column2.length).toEqual("100");
        expect(column2!.default)!.toEqual("'this is description'");

        await queryRunner.executeMemoryDownSql();

        table = await queryRunner.getTable("post");
        expect(table!.findColumnByName("secondId")).toBeUndefined();
        expect(table!.findColumnByName("description")).toBeUndefined();

        await queryRunner.release();
    })));

});
