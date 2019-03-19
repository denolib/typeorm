import "reflect-metadata";
import {createTestingConnections, closeTestingConnections, reloadTestingDatabases} from "../../utils/test-utils";
import {Connection} from "../../../src";
import {Record} from "./entity/Record";

describe("github issues > #1314 UPDATE on json column stores string type", () => {

    let connections: Connection[];
    beforeAll(async () => connections = await createTestingConnections({
        entities: [__dirname + "/entity/*{.js,.ts}"],
        enabledDrivers: ["postgres"] // because only postgres supports jsonb type
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("should not store json type as string on update", () => Promise.all(connections.map(async connection => {

        let recordRepo = connection.getRepository(Record);

        let record = new Record();
        record.data = { foo: "bar" };

        let persistedRecord = await recordRepo.save(record);
        expect(record.data).toEqual({ foo: "bar" });

        let foundRecord = await recordRepo.findOne(persistedRecord.id);
        expect(foundRecord).not.toBeUndefined();
        expect(foundRecord!.data.foo).toEqual("bar");

        // Update
        foundRecord!.data = {answer: 42};
        await recordRepo.save(foundRecord!);
        foundRecord = await recordRepo.findOne(persistedRecord.id);

        expect(foundRecord).not.toBeUndefined();
        expect(foundRecord!.data).not.toEqual("{\"answer\":42}");
        expect(foundRecord!.data.answer).toEqual(42);
    })));

});
