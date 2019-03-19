import "reflect-metadata";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils";
import {Connection} from "../../../src";
import {Post} from "./entity/Post";

describe("github issues > #493 pagination should work with string primary keys", () => {

    let connections: Connection[];
    beforeAll(async () => connections = await createTestingConnections({
        entities: [__dirname + "/entity/*{.js,.ts}"],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("should work perfectly with string primary keys", () => Promise.all(connections.map(async connection => {

        for (let i = 0; i < 10; i++) {
            const post = new Post();
            post.id = "post #" + i;
            post.title = "Hello Post #" + i;
            await connection.manager.save(post);
        }

        const loadedPosts = await connection.manager
            .createQueryBuilder(Post, "post")
            .take(5)
            .skip(0)
            .orderBy("post.id")
            .getMany();

        expect(loadedPosts.length).toEqual(5);
        expect(loadedPosts[0]!.id).toEqual("post #0");
        expect(loadedPosts[1]!.id).toEqual("post #1");
        expect(loadedPosts[2]!.id).toEqual("post #2");
        expect(loadedPosts[3]!.id).toEqual("post #3");
        expect(loadedPosts[4]!.id).toEqual("post #4");
    })));

});
