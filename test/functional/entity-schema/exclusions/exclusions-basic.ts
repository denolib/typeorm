import {runIfMain} from "../../../deps/mocha.ts";
import {expect} from "../../../deps/chai.ts";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../../utils/test-utils.ts";
import {Connection} from "../../../../src/connection/Connection.ts";
import {MeetingSchema} from "./entity/Meeting.ts";
// TODO(uki00a) uncomment this when PostgresDriver is implemented.
// import {PostgresDriver} from "../../../../src/driver/postgres/PostgresDriver.ts";

// TODO(uki00a) Remove `.skip` when PostgresDriver is implemented.
describe.skip("entity-schema > exclusions", () => {

    let connections: Connection[];
    before(async () => connections = await createTestingConnections({
        entities: [MeetingSchema as any],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("should create an exclusion constraint", () => Promise.all(connections.map(async connection => {
        // Only PostgreSQL supports exclusion constraints.
        if (false/*!(connection.driver instanceof PostgresDriver)*/) // TODO(uki00a) uncomment this when PostgresDriver is implemented.
            return;

        const queryRunner = connection.createQueryRunner();
        const table = await queryRunner.getTable("meeting");
        await queryRunner.release();

        expect(table!.exclusions.length).to.equal(1);

    })));

});

runIfMain(import.meta);
