import "reflect-metadata";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../../test/utils/test-utils";
import {Connection} from "../../../src";
import {Post} from "./entity/Post";

describe("github issues > #190 too many SQL variables when using setMaxResults in SQLite", () => {

    let connections: Connection[];
    beforeAll(async () => connections = await createTestingConnections({
        entities: [__dirname + "/entity/*{.js,.ts}"],
        enabledDrivers: ["sqlite"] // this issue only related to sqlite
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("should not fail if high max results is used", () => Promise.all(connections.map(async connection => {

        for (let i = 0; i < 1000; i++) {
            const post1 = new Post();
            post1.title = "Hello Post #1";
            await connection.manager.save(post1);
        }

        const loadedPosts = await connection.manager
            .createQueryBuilder(Post, "post")
            .leftJoinAndSelect("post.categories", "categories")
            .take(1000)
            .getMany();

        expect(loadedPosts.length).toEqual(1000);
    })));

});
