import "reflect-metadata";
import {Connection} from "../../../src";
import {CockroachDriver} from "../../../src/driver/cockroachdb/CockroachDriver";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils";

describe("query runner > drop primary key", () => {

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

    test("should correctly drop primary key and revert drop", () => Promise.all(connections.map(async connection => {

        // CockroachDB does not allow dropping primary key
        if (connection.driver instanceof CockroachDriver)
            return;

        const queryRunner = connection.createQueryRunner();

        let table = await queryRunner.getTable("post");
        expect(table!.findColumnByName("id")!.isPrimary).toBeTruthy();

        await queryRunner.dropPrimaryKey(table!);

        table = await queryRunner.getTable("post");
        expect(table!.findColumnByName("id")!.isPrimary).toBeFalsy();

        await queryRunner.executeMemoryDownSql();

        table = await queryRunner.getTable("post");
        expect(table!.findColumnByName("id")!.isPrimary).toBeTruthy();

        await queryRunner.release();
    })));

});
