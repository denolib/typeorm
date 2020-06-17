import "../../../../deps/chai.ts";
import {runIfMain} from "../../../../deps/mocha.ts";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../../../utils/test-utils.ts";
import {Connection} from "../../../../../src/connection/Connection.ts";
import {Profile} from "./entity/Profile.ts";
import {Photo} from "./entity/Photo.ts";
import {User} from "./entity/User.ts";

describe("persistence > cascades > example 1", () => {

    let connections: Connection[];
    before(async () => connections = await createTestingConnections({
        entities: [Photo, Profile, User],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("should insert everything by cascades properly", () => Promise.all(connections.map(async connection => {

        const photo = new Photo();

        const profile = new Profile();
        profile.photo = photo;

        const user = new User();
        user.name = "Umed";
        user.profile = profile;

        await connection.manager.save(user);

        const loadedUser = await connection.manager
            .createQueryBuilder(User, "user")
            .leftJoinAndSelect("user.profile", "profile")
            .leftJoinAndSelect("profile.photo", "profilePhoto")
            .leftJoinAndSelect("profile.user", "profileUser")
            .getOne();

        loadedUser!.should.be.eql({
            id: 1,
            name: "Umed",
            profile: {
                id: 1,
                photo: {
                    id: 1,
                    name: "My photo"
                },
                user: {
                    id: 1,
                    name: "Umed"
                }
            }
        });
    })));

});

runIfMain(import.meta);
