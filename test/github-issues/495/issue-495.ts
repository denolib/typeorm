import {runIfMain} from "../../deps/mocha.ts";
import "../../deps/chai.ts";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils.ts";
import {Connection} from "../../../src/connection/Connection.ts";
import {Item} from "./entity/Item.ts";
import {User} from "./entity/User.ts";

describe("github issues > #495 Unable to set multi-column indices", () => {

    let connections: Connection[];
    before(async () => connections = await createTestingConnections({
        entities: [Item, User],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("should successfully create indices and save an object", () => Promise.all(connections.map(async connection => {

        const user = new User();
        user.name = "stonecold";

        const item = new Item();
        item.userData = user;
        item.mid = 1;

        await connection.manager.save(user);
        await connection.manager.save(item);
    })));

});

runIfMain(import.meta);
