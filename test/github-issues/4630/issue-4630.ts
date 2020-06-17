import {runIfMain} from "../../deps/mocha.ts";
import "../../deps/chai.ts";
import {createTestingConnections, closeTestingConnections, reloadTestingDatabases} from "../../utils/test-utils.ts";
import {Connection} from "../../../src/connection/Connection.ts";
import { Realm } from "./entity/User.ts";
import {User} from "./entity/User.ts";

describe("github issues > #4630 Enum string not escaping resulting in broken migrations.", () => {

    let connections: Connection[];
    before(async () => connections = await createTestingConnections({
        entities: [User],
        schemaCreate: true,
        dropSchema: true,
        enabledDrivers: ["mysql", "postgres"]
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("should support enums of strings with apostrophes in them", () => Promise.all(connections.map(async connection => {
        const user = new User();
        user.realm = Realm.KelThuzad;

        await connection.manager.save(user);

        const users = await connection.manager.find(User);

        users.should.eql([{
            id: 1,
            realm: "Kel'Thuzad"
        }]);
    })));
});

runIfMain(import.meta);
