import {expect} from "../../../deps/chai.ts";
import {runIfMain} from "../../../deps/mocha.ts";
import {Connection} from "../../../../src/connection/Connection.ts";
import {User} from "./entity/User.ts";
import {AccessToken} from "./entity/AccessToken.ts";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../../utils/test-utils.ts";

describe("persistence > one-to-one", function() {

    // -------------------------------------------------------------------------
    // Setup
    // -------------------------------------------------------------------------

    let connections: Connection[];
    before(() => {
        return createTestingConnections({
            entities: [User, AccessToken],
        }).then(all => connections = all);
    });
    after(() => closeTestingConnections(connections));
    beforeEach(() => reloadTestingDatabases(connections));

    // -------------------------------------------------------------------------
    // Specifications
    // -------------------------------------------------------------------------

    describe("set the relation with proper item", function() {

        it("should have an access token", () => Promise.all(connections.map(async connection => {
            const userRepository = connection.getRepository(User);
            const accessTokenRepository = connection.getRepository(AccessToken);

            const newUser = userRepository.create();
            newUser.email = "mwelnick@test.com";
            await userRepository.save(newUser);

            const newAccessToken = accessTokenRepository.create();
            newAccessToken.user = newUser;
            await accessTokenRepository.save(newAccessToken);


            const loadedUser = await userRepository.findOne({
                where: { email: "mwelnick@test.com" },
                relations: ["access_token"]
            });

            expect(loadedUser).not.to.be.undefined;
            expect(loadedUser!.access_token).not.to.be.undefined;
        })));

    });

    describe("doesn't allow the same relation to be used twice", function() {

        it("should reject the saving attempt", () => Promise.all(connections.map(async connection => {
            const userRepository = connection.getRepository(User);
            const accessTokenRepository = connection.getRepository(AccessToken);

            const newUser = userRepository.create();
            newUser.email = "mwelnick@test.com";
            await userRepository.save(newUser);

            const newAccessToken1 = accessTokenRepository.create();
            newAccessToken1.user = newUser;
            await accessTokenRepository.save(newAccessToken1);

            const newAccessToken2 = accessTokenRepository.create();
            newAccessToken2.user = newUser;

            let error: Error | null = null;
            try {
                await accessTokenRepository.save(newAccessToken2);
            } catch (err) {
                error = err;
            }

            expect(error).to.be.instanceof(Error);
            expect(await userRepository.count({})).to.equal(1);
            expect(await accessTokenRepository.count({})).to.equal(1);
        })));

    });

});

runIfMain(import.meta);
