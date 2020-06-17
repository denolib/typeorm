import {runIfMain} from "../../deps/mocha.ts";
import "../../deps/chai.ts";
import {Connection} from "../../../src/connection/Connection.ts";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils.ts";
import {Post} from "./entity/Post.ts";

describe("github issues > #3949 sqlite date hydration is susceptible to corruption", () => {

    let connections: Connection[];
    before(async () => {
        connections = await createTestingConnections({
            entities: [Post],
            schemaCreate: true,
            dropSchema: true,
            enabledDrivers: ["sqlite", "sqljs"],
        });
    });
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    const testDateString = (sqlDateString: string, jsDateString: string) => async (connection: Connection) => {
        const queryRunner = connection.createQueryRunner();
        const repo = connection.getRepository(Post);

        await queryRunner.query(`INSERT INTO "POST"("id", "date") VALUES (?, ?)`, [1, sqlDateString]);

        const post = await repo.findOne(1);

        post!.date.should.eql(new Date(jsDateString));
    };

    it("should correctly read date column that was inserted raw in canonical format", () =>
        // Append UTC to javascript date string, because while sqlite assumes naive date strings are UTC,
        // javascript assumes they are in local system time.
        Promise.all(connections.map(testDateString("2018-03-14 02:33:33.906", "2018-03-14T02:33:33.906Z"))));

    it("should correctly read date column that was inserted raw in iso 8601 format", () =>
        Promise.all(connections.map(testDateString("2018-03-14T02:33:33.906+00:00", "2018-03-14T02:33:33.906Z"))));

});

runIfMain(import.meta);
