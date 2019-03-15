import "reflect-metadata";
import {Connection} from "../../../../src";
import {Post} from "./entity/Post";
import {PostDetails} from "./entity/PostDetails";
import {
    closeTestingConnections,
    createTestingConnections,
    reloadTestingDatabases
} from "../../../../test/utils/test-utils";

describe("cascades > should insert by cascades from both sides (#57)", () => {

    let connections: Connection[];
    beforeAll(async () => connections = await createTestingConnections({
        entities: [__dirname + "/entity/*{.js,.ts}"],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("should insert by cascades from owner side", () => Promise.all(connections.map(async connection => {

        // first create details but don't save them because they will be saved by cascades
        const details = new PostDetails();
        details.keyword = "post-1";

        // then create and save a post with details
        const post1 = new Post();
        post1.title = "Hello Post #1";
        post1.details = details;
        await connection.manager.save(post1);

        // now check
        const posts = await connection.manager.find(Post, {
            join: {
                alias: "post",
                innerJoinAndSelect: {
                    details: "post.details"
                }
            }
        });

        expect(posts).toEqual([{
            key: post1.key,
            title: post1.title,
            details: {
                keyword: "post-1"
            }
        }]);

    })));

});
