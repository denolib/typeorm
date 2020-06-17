import {runIfMain} from "../../deps/mocha.ts";
import {expect} from "../../deps/chai.ts";
import {createTestingConnections, closeTestingConnections, reloadTestingDatabases} from "../../utils/test-utils.ts";
import {Connection} from "../../../src/connection/Connection.ts";
import {Record} from "./entity/Record.ts";

describe("github issues > #1314 UPDATE on json column stores string type", () => {

    let connections: Connection[];
    before(async () => connections = await createTestingConnections({
        entities: [Record],
        enabledDrivers: ["postgres"] // because only postgres supports jsonb type
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("should not store json type as string on update", () => Promise.all(connections.map(async connection => {

        let recordRepo = connection.getRepository(Record);

        let record = new Record();
        record.data = { foo: "bar" };

        let persistedRecord = await recordRepo.save(record);
        record.data.should.be.eql({ foo: "bar" });

        let foundRecord = await recordRepo.findOne(persistedRecord.id);
        expect(foundRecord).to.be.not.undefined;
        expect(foundRecord!.data.foo).to.eq("bar");

        // Update
        foundRecord!.data = {answer: 42};
        await recordRepo.save(foundRecord!);
        foundRecord = await recordRepo.findOne(persistedRecord.id);

        expect(foundRecord).to.be.not.undefined;
        expect(foundRecord!.data).to.not.be.equal("{\"answer\":42}");
        expect(foundRecord!.data.answer).to.eq(42);
    })));

});

runIfMain(import.meta);
