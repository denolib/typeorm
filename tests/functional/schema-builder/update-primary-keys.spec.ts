import "reflect-metadata";
import {Connection} from "../../../src";
import {CockroachDriver} from "../../../src/driver/cockroachdb/CockroachDriver";
import {closeTestingConnections, createTestingConnections} from "../../../test/utils/test-utils";
import {Category} from "./entity/Category";
import {Question} from "./entity/Question";
import {AbstractSqliteDriver} from "../../../src/driver/sqlite-abstract/AbstractSqliteDriver";

describe("schema builder > update primary keys", () => {

    let connections: Connection[];
    beforeAll(async () => {
        connections = await createTestingConnections({
            entities: [__dirname + "/entity/*{.js,.ts}"],
            schemaCreate: true,
            dropSchema: true,
        });
    });
    afterAll(() => closeTestingConnections(connections));

    test("should correctly update composite primary keys", () => Promise.all(connections.map(async connection => {

        // CockroachDB does not support changing primary key constraint
        if (connection.driver instanceof CockroachDriver)
            return;

        const metadata = connection.getMetadata(Category);
        const nameColumn = metadata.findColumnWithPropertyName("name");
        nameColumn!.isPrimary = true;

        await connection.synchronize();

        const queryRunner = connection.createQueryRunner();
        const table = await queryRunner.getTable("category");
        expect(table!.findColumnByName("id")!.isPrimary).toBeTruthy();
        expect(table!.findColumnByName("name")!.isPrimary).toBeTruthy();

        await queryRunner.release();
    })));

    test("should correctly update composite primary keys when table already have primary generated column", () => Promise.all(connections.map(async connection => {
        // Sqlite does not support AUTOINCREMENT on composite primary key
        if (connection.driver instanceof AbstractSqliteDriver)
            return;

        // CockroachDB does not support changing primary key constraint
        if (connection.driver instanceof CockroachDriver)
            return;

        const metadata = connection.getMetadata(Question);
        const nameColumn = metadata.findColumnWithPropertyName("name");
        nameColumn!.isPrimary = true;

        await connection.synchronize();

        const queryRunner = connection.createQueryRunner();
        const table = await queryRunner.getTable("question");
        expect(table!.findColumnByName("id")!.isPrimary).toBeTruthy();
        expect(table!.findColumnByName("name")!.isPrimary).toBeTruthy();

        await queryRunner.release();
    })));

});
