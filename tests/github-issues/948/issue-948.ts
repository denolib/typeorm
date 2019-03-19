import "reflect-metadata";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils";
import {Connection} from "../../../src";
import {User} from "./entity/User";

describe("github issues > #948 EntityManager#save always considers a Postgres array-type field to have changed", () => {

    let connections: Connection[];
    beforeAll(async () => connections = await createTestingConnections({
        entities: [__dirname + "/entity/*{.js,.ts}"],
        enabledDrivers: ["postgres"]
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("should not produce extra query when array is updated?", () => Promise.all(connections.map(async connection => {

        const user = new User();
        user.name = "Hello Test";
        user.roles = ["admin", "user"];
        await connection.manager.save(user);

        // todo: produces update query but it should not
        await connection.manager.save(user);

    })));

});
