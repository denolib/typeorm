import "reflect-metadata";
import {Connection} from "../../../../src";
import {closeTestingConnections, createTestingConnections} from "../../../../test/utils/test-utils";

describe("indices > conditional index", () => {

    let connections: Connection[];
    beforeAll(async () => {
        connections = await createTestingConnections({
            entities: [__dirname + "/entity/*{.js,.ts}"],
            enabledDrivers: ["mssql", "postgres", "sqlite"], // only these drivers supports conditional indices
            schemaCreate: true,
            dropSchema: true,
        });
    });
    afterAll(() => closeTestingConnections(connections));

    test("should correctly create conditional indices with WHERE condition", () => Promise.all(connections.map(async connection => {

        const queryRunner = connection.createQueryRunner();
        let table = await queryRunner.getTable("post");

        expect(table!.indices.length).toEqual(2);
        expect(table!.indices[0].where).toBeDefined();
        expect(table!.indices[1].where).toBeDefined();

        await queryRunner.release();

    })));

    test("should correctly drop conditional indices and revert drop", () => Promise.all(connections.map(async connection => {

        const queryRunner = connection.createQueryRunner();
        let table = await queryRunner.getTable("post");
        expect(table!.indices.length).toEqual(2);
        expect(table!.indices[0].where).toBeDefined();
        expect(table!.indices[1].where).toBeDefined();

        await queryRunner.dropIndices(table!, table!.indices);

        table = await queryRunner.getTable("post");
        expect(table!.indices.length).toEqual(0);

        await queryRunner.executeMemoryDownSql();

        table = await queryRunner.getTable("post");
        expect(table!.indices.length).toEqual(2);
        expect(table!.indices[0].where).toBeDefined();
        expect(table!.indices[1].where).toBeDefined();

        await queryRunner.release();

    })));

});
