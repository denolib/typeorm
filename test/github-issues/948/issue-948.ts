import {runIfMain} from "../../deps/mocha.ts";
import "../../deps/chai.ts";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils.ts";
import {Connection} from "../../../src/connection/Connection.ts";
import {User} from "./entity/User.ts";

describe("github issues > #948 EntityManager#save always considers a Postgres array-type field to have changed", () => {

    let connections: Connection[];
    before(async () => connections = await createTestingConnections({
        entities: [User],
        enabledDrivers: ["postgres"]
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("should not produce extra query when array is updated?", () => Promise.all(connections.map(async connection => {

        const user = new User();
        user.name = "Hello Test";
        user.roles = ["admin", "user"];
        await connection.manager.save(user);

        // todo: produces update query but it should not
        await connection.manager.save(user);

    })));

});

runIfMain(import.meta);
