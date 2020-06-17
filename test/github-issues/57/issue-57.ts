import {runIfMain} from "../../deps/mocha.ts";
import {expect} from "../../deps/chai.ts";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils.ts";
import {Connection} from "../../../src/connection/Connection.ts";
import {User} from "./entity/User.ts";
import {AccessToken} from "./entity/AccessToken.ts";

describe("github issues > #57 cascade insert not working with OneToOne relationship", () => {

    let connections: Connection[];
    before(async () => connections = await createTestingConnections({
        entities: [AccessToken, User],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    // this test is no absolutely complete because cascade is now only allowed from one side of the relation

    it("should persist successfully from inverse side", () => Promise.all(connections.map(async connection => {

        // create
        const token = new AccessToken();
        token.expireTime = 60000;
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

        expect(tokens).not.to.be.undefined;
        tokens.should.be.eql([{
            primaryKey: 1,
            expireTime: 60000,
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

        expect(users).not.to.be.undefined;
        users.should.be.eql([{
            primaryKey: 1,
            email: "mwelnick@test.com",
            access_token: {
                primaryKey: 1,
                expireTime: 60000,
            }
        }]);

    })));

});

runIfMain(import.meta);
