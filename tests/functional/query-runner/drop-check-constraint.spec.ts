import "reflect-metadata";
import {Connection} from "../../../src";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../../test/utils/test-utils";
import {MysqlDriver} from "../../../src/driver/mysql/MysqlDriver";

describe("query runner > drop check constraint", () => {

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

    test("should correctly drop check constraint and revert drop", () => Promise.all(connections.map(async connection => {

        // Mysql does not support check constraints.
        if (connection.driver instanceof MysqlDriver)
            return;

        const queryRunner = connection.createQueryRunner();

        let table = await queryRunner.getTable("post");
        expect(table!.checks.length).toEqual(1);

        await queryRunner.dropCheckConstraint(table!, table!.checks[0]);

        table = await queryRunner.getTable("post");
        expect(table!.checks.length).toEqual(0);

        await queryRunner.executeMemoryDownSql();

        table = await queryRunner.getTable("post");
        expect(table!.checks.length).toEqual(1);

        await queryRunner.release();
    })));

});
