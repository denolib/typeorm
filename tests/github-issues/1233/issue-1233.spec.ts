import "reflect-metadata";
import {createTestingConnections, closeTestingConnections, reloadTestingDatabases} from "../../../test/utils/test-utils";
import {Connection} from "../../../src";
import {Post} from "./entity/Post";

describe("github issues > #1233 column updatedDate must appear in the GROUP BY clause or be used in an aggregate function", () => {

    let connections: Connection[];
    beforeAll(async () => connections = await createTestingConnections({
        entities: [__dirname + "/entity/*{.js,.ts}"],
        enabledDrivers: ["postgres"]
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("should filter correctly using findByIds", () => Promise.all(connections.map(async connection => {

        let post1 = new Post();
        post1.name = "post #1";
        await connection.manager.save(post1);

        let post2 = new Post();
        post2.name = "post #1";
        await connection.manager.save(post2);

        const [loadedPosts, count] = await connection.manager.findAndCount(Post, {
            skip: 1,
            take: 1
        });
        expect(loadedPosts.length).toEqual(1);
        expect(loadedPosts[0].id).toEqual(1);
        expect(count).toEqual(2);

    })));

});
