import "reflect-metadata";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils";
import {Connection} from "../../../src";
import {Post} from "./entity/Post";
import {User} from "./entity/User";

describe("github issues > #1178 subqueries must work in insert statements", () => {

    let connections: Connection[];
    beforeAll(async () => connections = await createTestingConnections({
        entities: [__dirname + "/entity/*{.js,.ts}"],
        enabledDrivers: ["postgres"]
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("should work fine", () => Promise.all(connections.map(async connection => {

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

        const post = await connection.manager.findOne(Post, 1, { relations: ["user"] });
        expect(post).toEqual({
            id: 1,
            name: "First post",
            user: {
                id: 1,
                name: "Timber Saw"
            }
        });

    })));

});
