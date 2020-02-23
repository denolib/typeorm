import {join as joinPaths} from "../../../vendor/https/deno.land/std/path/mod.ts";
import {runIfMain} from "../../deps/mocha.ts";
import {expect} from "../../deps/chai.ts";
import {getDirnameOfCurrentModule, closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils.ts";
import {Connection} from "../../../src/connection/Connection.ts";
import {User} from "./entity/User.ts";

describe("other issues > ekifox reported issue with increment", () => {

    let connections: Connection[];
    const __dirname = getDirnameOfCurrentModule(import.meta);
    before(async () => connections = await createTestingConnections({
        entities: [joinPaths(__dirname, "/entity/*.ts")],
        enabledDrivers: ["postgres"]
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("getters and setters should work correctly", () => Promise.all(connections.map(async connection => {

        const user = new User();
        user.id = 1;
        user.nickName = "pleerock";
        await connection.manager.save(user);

        await connection.manager.update(User, { id: 1 }, {
            friendsInvitesCount: () => "friends_invites_count + 1"
        });

        const loadedUser = await connection
            .manager
            .createQueryBuilder(User, "user")
            .where("user.id = :id", { id: 1 })
            .getOne();

        expect(loadedUser).not.to.be.undefined;
        loadedUser!.id.should.be.equal(1);
        loadedUser!.friendsInvitesCount.should.be.equal(1);

    })));

});

runIfMain(import.meta);
