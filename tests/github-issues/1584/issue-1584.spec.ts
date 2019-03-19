import "reflect-metadata";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils";
import {Connection} from "../../../src";
import {User} from "./entity/User";

describe("github issues > #1584 Cannot read property 'createValueMap' of undefined", () => {

    let connections: Connection[];
    beforeAll(async () => connections = await createTestingConnections({
        entities: [__dirname + "/entity/*{.js,.ts}"],
        enabledDrivers: ["mongodb"]
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("should save entities properly", () => Promise.all(connections.map(async connection => {
        await connection.manager.save(connection.manager.create(User, {
            name: "Timber Saw"
        }));
    })));

});
