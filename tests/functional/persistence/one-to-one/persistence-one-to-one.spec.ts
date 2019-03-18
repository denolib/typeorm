import "reflect-metadata";
import {Connection} from "../../../../src";
import {User} from "./entity/User";
import {AccessToken} from "./entity/AccessToken";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../../../test/utils/test-utils";

describe("persistence > one-to-one", function() {

    // -------------------------------------------------------------------------
    // Setup
    // -------------------------------------------------------------------------

    let connections: Connection[];
    beforeAll(() => {
        return createTestingConnections({
            entities: [User, AccessToken],
        }).then(all => connections = all);
    });
    afterAll(() => closeTestingConnections(connections));
    beforeEach(() => reloadTestingDatabases(connections));

    // -------------------------------------------------------------------------
    // Specifications
    // -------------------------------------------------------------------------

    describe("set the relation with proper item", function() {

        test("should have an access token", () => Promise.all(connections.map(async connection => {
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

            expect(loadedUser).not.toBeUndefined();
            expect(loadedUser!.access_token).not.toBeUndefined();
        })));

    });

    describe("doesn't allow the same relation to be used twice", function() {

        test("should reject the saving attempt", () => Promise.all(connections.map(async connection => {
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

            expect(error).toBeInstanceOf(Error);
            expect(await userRepository.count({})).toEqual(1);
            expect(await accessTokenRepository.count({})).toEqual(1);
        })));

    });

});
