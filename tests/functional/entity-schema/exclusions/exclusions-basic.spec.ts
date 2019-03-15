import "reflect-metadata";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../../../test/utils/test-utils";
import {Connection} from "../../../../src";
import {MeetingSchema} from "./entity/Meeting";
import {PostgresDriver} from "../../../../src/driver/postgres/PostgresDriver";

describe("entity-schema > exclusions", () => {

    let connections: Connection[];
    beforeAll(async () => connections = await createTestingConnections({
        entities: [<any>MeetingSchema],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("should create an exclusion constraint", () => Promise.all(connections.map(async connection => {
        // Only PostgreSQL supports exclusion constraints.
        if (!(connection.driver instanceof PostgresDriver))
            return;

        const queryRunner = connection.createQueryRunner();
        const table = await queryRunner.getTable("meeting");
        await queryRunner.release();

        expect(table!.exclusions.length).toEqual(1);

    })));

});
