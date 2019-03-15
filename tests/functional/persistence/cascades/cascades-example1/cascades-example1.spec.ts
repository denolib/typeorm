import "reflect-metadata";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../../../../test/utils/test-utils";
import {Connection} from "../../../../../src";
import {Profile} from "./entity/Profile";
import {Photo} from "./entity/Photo";
import {User} from "./entity/User";

describe("persistence > cascades > example 1", () => {

    let connections: Connection[];
    beforeAll(async () => connections = await createTestingConnections({
        entities: [__dirname + "/entity/*{.js,.ts}"],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("should insert everything by cascades properly", () => Promise.all(connections.map(async connection => {

        const photo = new Photo();

        const profile = new Profile();
        profile.photo = photo;

        const user = new User();
        user.profile = profile;

        await connection.manager.save(user);

        const loadedUser = await connection.manager
            .createQueryBuilder(User, "user")
            .leftJoinAndSelect("user.profile", "profile")
            .leftJoinAndSelect("profile.photo", "profilePhoto")
            .leftJoinAndSelect("profile.user", "profileUser")
            .getOne();

        expect(loadedUser)!.toEqual({
            id: 1,
            profile: {
                id: 1,
                photo: {
                    id: 1
                },
                user: {
                    id: 1
                }
            }
        });
    })));

});
