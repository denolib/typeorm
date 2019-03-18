import {Connection} from "../../../src";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../../test/utils/test-utils";
import {User} from "./entity/User";

describe("github issues > #2006 Columns are being set to null after saving the entity", () => {

    let connections: Connection[];
    beforeAll(async () => connections = await createTestingConnections({
        entities: [__dirname + "/entity/*{.js,.ts}"],
        enabledDrivers: ["mysql"]
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("should be able to find by boolean find", () => Promise.all(connections.map(async connection => {
        const user = new User();
        user.token = "sometoken";
        await connection.manager.save(user);
        expect(user.token).toEqual("sometoken");
    })));

});
