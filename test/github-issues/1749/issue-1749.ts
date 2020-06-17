import {runIfMain} from "../../deps/mocha.ts";
import "../../deps/chai.ts";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils.ts";
import {Connection} from "../../../src/connection/Connection.ts";
import {Bar} from "./entity/Bar.ts";

describe("github issues > #1749 Can't delete tables in non-default schema", () => {

    let connections: Connection[];
    before(async () => connections = await createTestingConnections({
        entities: [Bar],
        enabledDrivers: ["postgres"]
    }));

    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("should delete entites from tables in different schemas", () => Promise.all(connections.map(async connection => {
        const bar = new Bar();
        const persistedBar = await connection.manager.save(bar);

        await connection.manager.delete(Bar, persistedBar.id);

    })));

});

runIfMain(import.meta);
