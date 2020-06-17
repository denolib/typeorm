import {runIfMain} from "../../deps/mocha.ts";
import {expect} from "../../deps/chai.ts";
import {createTestingConnections, closeTestingConnections, reloadTestingDatabases} from "../../utils/test-utils.ts";
import {Connection} from "../../../src/connection/Connection.ts";
import {User} from "./entity/User.ts";

// TODO: wrong test
describe.skip("github issues > #2147 Lazy load JoinColumn with multiple columns name property is ignored for second reference column", () => {

    let connections: Connection[];
    before(async () => connections = await createTestingConnections({
         entities: [User],
         schemaCreate: true,
         dropSchema: true,
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("should create multiple column join for lazy loading relationship", () => {
        return Promise.all(connections.map(async connection => {
            // tests go here
            const username = "user name";
            const user = new User();
            user.key = 10;
            user.clientId = 16;
            user.name = username;
            user.updatedById = 10;
            await connection.manager.save(user);

            const users = await connection.manager.find(User);

            const updatedBy = await users[0].updatedBy;

            return expect(updatedBy.name).to.be.equal(username);

        }));
    });
});

runIfMain(import.meta);
