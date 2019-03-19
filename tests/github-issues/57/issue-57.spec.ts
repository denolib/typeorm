import "reflect-metadata";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils";
import {Connection} from "../../../src";
import {User} from "./entity/User";
import {AccessToken} from "./entity/AccessToken";

describe("github issues > #57 cascade insert not working with OneToOne relationship", () => {

    let connections: Connection[];
    beforeAll(async () => connections = await createTestingConnections({
        entities: [__dirname + "/entity/*{.js,.ts}"],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    // this test is no absolutely complete because cascade is now only allowed from one side of the relation

    test("should persist successfully from inverse side", () => Promise.all(connections.map(async connection => {

        // create
        const token = new AccessToken();
        const user = new User();
        user.email = "mwelnick@test.com";
        user.access_token = token; // this is not necessary at all
        token.user = user; // this is necessary to cascades to work because we are saving token, not user

        // save
        await connection.getRepository(AccessToken).save(token);

        // get to check
        const tokens = await connection.getRepository(AccessToken)
            .createQueryBuilder("token")
            .innerJoinAndSelect("token.user", "user")
            .getMany();

        expect(tokens).not.toBeUndefined();
        expect(tokens).toEqual([{
            primaryKey: 1,
            user: {
                primaryKey: 1,
                email: "mwelnick@test.com",
            }
        }]);

        // get from inverse side and check
        const users = await connection.getRepository(User)
            .createQueryBuilder("user")
            .innerJoinAndSelect("user.access_token", "token")
            .getMany();

        expect(users).not.toBeUndefined();
        expect(users).toEqual([{
            primaryKey: 1,
            email: "mwelnick@test.com",
            access_token: {
                primaryKey: 1
            }
        }]);

    })));

});
