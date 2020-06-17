import {runIfMain} from "../../deps/mocha.ts";
import {expect} from "../../deps/chai.ts";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils.ts";
import {Connection} from "../../../src/connection/Connection.ts";
import {Post} from "./entity/Post.ts";
import {User} from "./entity/User.ts";

describe("github issues > #1178 subqueries must work in insert statements", () => {

    let connections: Connection[];
    before(async () => connections = await createTestingConnections({
        entities: [Post, User],
        enabledDrivers: ["postgres"]
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("should work fine", () => Promise.all(connections.map(async connection => {

        const user = new User();
        user.name = "Timber Saw";
        await connection.manager.save(user);

        await connection
            .getRepository(Post)
            .createQueryBuilder()
            .insert()
            .values({
                name: "First post",
                user: () => `(SELECT "user"."id" FROM "user" WHERE "user"."name" = :userName)`,
            })
            .setParameter("userName",  "Timber Saw")
            .returning("*")
            .execute();

        expect(await connection.manager.findOne(Post, 1, { relations: ["user"] })).to.eql({
            id: 1,
            name: "First post",
            user: {
                id: 1,
                name: "Timber Saw"
            }
        });
    })));

});

runIfMain(import.meta);
