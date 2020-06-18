import {runIfMain} from "../../deps/mocha.ts";
import {expect} from "../../deps/chai.ts";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils.ts";
import {Connection} from "../../../src/connection/Connection.ts";
import {User} from "./entity/User.ts";
import {AccessToken} from "./entity/AccessToken.ts";

describe.skip("github issues > #56 relationships only work when both primary keys have the same name", () => { // skipped because of CI error. todo: needs investigation

    let connections: Connection[];
    before(async () => connections = await createTestingConnections({
        entities: [AccessToken, User],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("should persist successfully and return persisted entity", () => Promise.all(connections.map(async connection => {

        const token = new AccessToken();
        token.access_token = "12345";

        const user = new User();
        user.email = "mwelnick@test.com";
        user.access_token = token;

        return connection.getRepository(AccessToken).save(token).then(token => {
            return connection.getRepository(User).save(user);
        }).then (user => {
            expect(user).not.to.be.undefined;
            user.should.be.eql({
                id: 1,
                email: "mwelnick@test.com",
                access_token: {
                    access_token: "12345"
                }
            });
        });

    })));

});

runIfMain(import.meta);
