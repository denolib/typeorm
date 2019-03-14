import "reflect-metadata";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../../../test/utils/test-utils";
import {Connection} from "../../../../src";
import {Post} from "./entity/Post";
import {PostDetails} from "./entity/PostDetails";

describe.skip("relations > relation mapped to relation with different name (#56)", () => { // skipped because of CI error. todo: needs investigation

    let connections: Connection[];
    beforeAll(async () => connections = await createTestingConnections({
        entities: [__dirname + "/entity/*{.js,.ts}"],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("should work perfectly", () => Promise.all(connections.map(async connection => {

        // first create and save details
        const details = new PostDetails();
        details.keyword = "post-1";
        await connection.manager.save(details);

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
            id: 1,
            title: "Hello Post #1",
            details: {
                keyword: "post-1"
            }
        }]);
    })));

});
