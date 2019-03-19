import "reflect-metadata";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../../test/utils/test-utils";
import {Connection} from "../../../src";
import {User} from "./entity/User";
import {AccessToken} from "./entity/AccessToken";

describe.skip("github issues > #56 relationships only work when both primary keys have the same name", () => { // skipped because of CI error. todo: needs investigation

    let connections: Connection[];
    beforeAll(async () => connections = await createTestingConnections({
        entities: [__dirname + "/entity/*{.js,.ts}"],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("should persist successfully and return persisted entity", () => Promise.all(connections.map(async connection => {

        const token = new AccessToken();
        token.access_token = "12345";

        const user = new User();
        user.email = "mwelnick@test.com";
        user.access_token = token;

        return connection.getRepository(AccessToken).save(token).then(token => {
            return connection.getRepository(User).save(user);
        }).then (user => {
            expect(user).not.toBeUndefined();
            expect(user).toEqual({
                id: 1,
                email: "mwelnick@test.com",
                access_token: {
                    access_token: "12345"
                }
            });
        });

    })));

});
