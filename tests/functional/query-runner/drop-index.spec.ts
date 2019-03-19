import "reflect-metadata";
import {Connection} from "../../../src";
import {CockroachDriver} from "../../../src/driver/cockroachdb/CockroachDriver";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils";

describe("query runner > drop index", () => {

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

    test("should correctly drop index and revert drop", () => Promise.all(connections.map(async connection => {

        const queryRunner = connection.createQueryRunner();

        let table = await queryRunner.getTable("student");
        // CockroachDB also stores indices for relation columns
        if (connection.driver instanceof CockroachDriver) {
            expect(table!.indices.length).toEqual(3);
        } else {
            expect(table!.indices.length).toEqual(1);
        }

        await queryRunner.dropIndex(table!, table!.indices[0]);

        table = await queryRunner.getTable("student");
        // CockroachDB also stores indices for relation columns
        if (connection.driver instanceof CockroachDriver) {
            expect(table!.indices.length).toEqual(2);
        } else {
            expect(table!.indices.length).toEqual(0);
        }

        await queryRunner.executeMemoryDownSql();

        table = await queryRunner.getTable("student");
        // CockroachDB also stores indices for relation columns
        if (connection.driver instanceof CockroachDriver) {
            expect(table!.indices.length).toEqual(3);
        } else {
            expect(table!.indices.length).toEqual(1);
        }

        await queryRunner.release();
    })));

});
