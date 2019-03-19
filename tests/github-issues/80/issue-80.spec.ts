import "reflect-metadata";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils";
import {Connection} from "../../../src";
import {Post} from "./entity/Post";

describe("github issues > #80 repository.save fails when empty array is sent to the method", () => {

    let connections: Connection[];
    beforeAll(async () => connections = await createTestingConnections({
        entities: [__dirname + "/entity/*{.js,.ts}"],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("should persist successfully and return persisted entity", () => Promise.all(connections.map(async connection => {
        const post = new Post();
        post.title = "Hello Post #1";
        const returnedPost = await connection.manager.save(post);

        expect(returnedPost).not.toBeUndefined();
        expect(returnedPost).toEqual(post);
    })));

    test("should not fail if empty array is given to persist method", () => Promise.all(connections.map(async connection => {
        const posts: Post[] = [];
        const returnedPosts = await connection.manager.save(posts);
        expect(returnedPosts).not.toBeUndefined();
        expect(returnedPosts).toEqual(posts);
    })));

});
