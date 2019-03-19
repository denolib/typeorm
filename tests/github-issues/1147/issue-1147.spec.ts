import "reflect-metadata";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils";
import {Connection} from "../../../src";
import {Post} from "./entity/Post";

describe("github issues > #1147 FindOptions should be able to accept custom where condition", () => {

    let connections: Connection[];
    beforeAll(async () => connections = await createTestingConnections({
        entities: [__dirname + "/entity/*{.js,.ts}"],
        schemaCreate: true,
        dropSchema: true,
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("should properly query using custom sql", () => Promise.all(connections.map(async connection => {

        const promises: Promise<any>[] = [];
        for (let i = 1; i <= 5; i++) {
            const post1 = new Post();
            post1.title = `post ${i}`;
            promises.push(connection.manager.save(post1));
        }
        await Promise.all(promises);

        const posts = await connection.manager.find(Post, { where: "Post.title LIKE '%3'" });
        expect(posts.length).toEqual(1);
        expect(posts[0].title).toEqual("post 3");
    })));

});
