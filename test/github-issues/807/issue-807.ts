import {runIfMain} from "../../deps/mocha.ts";
import "../../deps/chai.ts";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils.ts";
import {Connection} from "../../../src/connection/Connection.ts";
import {Tournament} from "./entity/Tournament.ts";

describe("github issues > #807 Error in persisting dates", () => {

    let connections: Connection[];
    before(async () => connections = await createTestingConnections({
        entities: [Tournament],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("should be able to save dates as objects", () => Promise.all(connections.map(async connection => {
        const tournament = new Tournament();
        tournament.name = "One";
        tournament.startDate = new Date();
        tournament.endDate = new Date();
        await connection.manager.save(tournament);
    })));

    it("should be able to save dates as strings", () => Promise.all(connections.map(async connection => {
        const tournament = Object.assign(new Tournament(), {
            name: "One",
            startDate: "2017-08-28T00:00:00.000Z",
            endDate: "2017-08-31T23:59:59.999Z",
        });
        await connection.manager.save(tournament);
    })));

});

runIfMain(import.meta);
