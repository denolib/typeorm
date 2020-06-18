import {runIfMain} from "../../deps/mocha.ts";
import "../../deps/chai.ts";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils.ts";
import {Connection} from "../../../src/connection/Connection.ts";
import {User} from "./entity/User.ts";

describe("github issues > #1584 Cannot read property 'createValueMap' of undefined", () => {

    let connections: Connection[];
    before(async () => connections = await createTestingConnections({
        entities: [User],
        enabledDrivers: ["mongodb"]
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("should save entities properly", () => Promise.all(connections.map(async connection => {
        await connection.manager.save(connection.manager.create(User, {
            name: "Timber Saw"
        }));
    })));

});

runIfMain(import.meta);
