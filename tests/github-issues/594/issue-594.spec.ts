import "reflect-metadata";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../../test/utils/test-utils";
import {Connection} from "../../../src";
import {Post} from "./entity/Post";

describe("github issues > #594 WhereInIds no longer works in the latest version.", () => {

    let connections: Connection[];
    beforeAll(async () => connections = await createTestingConnections({
        entities: [__dirname + "/entity/*{.js,.ts}"],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("should load entities by given simple post ids (non mixed)", () => Promise.all(connections.map(async connection => {

        for (let i = 0; i < 10; i++) {
            const post = new Post();
            post.modelId = i;
            await connection.manager.save(post);
        }

        const loadedPosts = await connection.manager
            .createQueryBuilder(Post, "post")
            .whereInIds([1, 2, 5])
            .getMany();

        expect(loadedPosts.length).toEqual(3);
        expect(loadedPosts[0]!.postId).toEqual(1);
        expect(loadedPosts[1]!.postId).toEqual(2);
        expect(loadedPosts[2]!.postId).toEqual(5);
    })));

});
