import "reflect-metadata";
import {Record} from "./entity/Record";
import {Connection} from "../../../src";
import {closeTestingConnections, createTestingConnections} from "../../../test/utils/test-utils";

describe("jsonb type", () => {

    let connections: Connection[];
    beforeAll(async () => connections = await createTestingConnections({
        entities: [Record],
        enabledDrivers: ["postgres"] // because only postgres supports jsonb type
    }));
    // beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("should make correct schema with Postgres' jsonb type", () => Promise.all(connections.map(async connection => {
        await connection.synchronize(true);
        const queryRunner = connection.createQueryRunner();
        let schema = await queryRunner.getTable("record");
        await queryRunner.release();
        expect(schema).not.toBeUndefined();
        expect(schema!.columns.find(tableColumn => tableColumn.name === "config" && tableColumn.type === "json")).toBeDefined();
        expect(schema!.columns.find(tableColumn => tableColumn.name === "data" && tableColumn.type === "jsonb")).toBeDefined();
    })));

    test("should persist jsonb correctly", () => Promise.all(connections.map(async connection => {
        await connection.synchronize(true);
        let recordRepo = connection.getRepository(Record);
        let record = new Record();
        record.data = { foo: "bar" };
        let persistedRecord = await recordRepo.save(record);
        let foundRecord = await recordRepo.findOne(persistedRecord.id);
        expect(foundRecord).not.toBeUndefined();
        expect(foundRecord!.data.foo).toEqual("bar");
    })));

    test("should persist jsonb string correctly", () => Promise.all(connections.map(async connection => {
        let recordRepo = connection.getRepository(Record);
        let record = new Record();
        record.data = "foo";
        let persistedRecord = await recordRepo.save(record);
        let foundRecord = await recordRepo.findOne(persistedRecord.id);
        expect(foundRecord).not.toBeUndefined();
        expect(typeof foundRecord!.data).toEqual("string");
        expect(foundRecord!.data).toEqual("foo");
    })));

    test("should persist jsonb array correctly", () => Promise.all(connections.map(async connection => {
        let recordRepo = connection.getRepository(Record);
        let record = new Record();
        record.data = [1, "2", { a: 3 }];
        let persistedRecord = await recordRepo.save(record);
        let foundRecord = await recordRepo.findOne(persistedRecord.id);
        expect(foundRecord).not.toBeUndefined();

        expect(foundRecord!.data).toEqual([1, "2", { a: 3 }]);
        // expect(foundRecord!.data).to.deep.include.members([1, "2", { a: 3 }]);
    })));
});
