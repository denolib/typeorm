import "reflect-metadata";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../../test/utils/test-utils";
import {Connection} from "../../../src";
import {Item} from "./entity/Item";
import {User} from "./entity/User";

describe("github issues > #495 Unable to set multi-column indices", () => {

    let connections: Connection[];
    beforeAll(async () => connections = await createTestingConnections({
        entities: [__dirname + "/entity/*{.js,.ts}"],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("should successfully create indices and save an object", () => Promise.all(connections.map(async connection => {

        const user = new User();
        user.name = "stonecold";

        const item = new Item();
        item.userData = user;
        item.mid = 1;

        await connection.manager.save(user);
        await connection.manager.save(item);
    })));

});
