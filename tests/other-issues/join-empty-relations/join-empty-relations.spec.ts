import "reflect-metadata";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils";
import {Connection} from "../../../src";
import {Post} from "./entity/Post";

describe("other issues > joining empty relations", () => {

    let connections: Connection[];
    beforeAll(async () => connections = await createTestingConnections({
        entities: [__dirname + "/entity/*{.js,.ts}"],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("should return empty array if its joined and nothing was found", () => Promise.all(connections.map(async function(connection) {

        const post = new Post();
        post.title = "Hello Post";
        await connection.manager.save(post);

        // check if ordering by main object works correctly

        const loadedPosts1 = await connection.manager
            .createQueryBuilder(Post, "post")
            .leftJoinAndSelect("post.categories", "categories")
            .getMany();

        expect(loadedPosts1).not.toBeUndefined();
        expect(loadedPosts1).toEqual([{
            id: 1,
            title: "Hello Post",
            categories: []
        }]);

    })));

    test("should return empty array if its joined and nothing was found, but relations in empty results should be skipped", () => Promise.all(connections.map(async function(connection) {

        const post = new Post();
        post.title = "Hello Post";
        await connection.manager.save(post);

        // check if ordering by main object works correctly

        const loadedPosts1 = await connection.manager
            .createQueryBuilder(Post, "post")
            .leftJoinAndSelect("post.categories", "categories")
            .leftJoinAndSelect("categories.authors", "authors")
            .getMany();

        expect(loadedPosts1).not.toBeUndefined();
        expect(loadedPosts1).toEqual([{
            id: 1,
            title: "Hello Post",
            categories: []
        }]);

    })));

});
