import "reflect-metadata";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../../../test/utils/test-utils";
import {Connection} from "../../../../src";
import {Post} from "./entity/Post";

describe("repository > clear method", () => {

    let connections: Connection[];
    beforeAll(async () => connections = await createTestingConnections({
        entities: [Post],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("should remove everything", () => Promise.all(connections.map(async connection => {

        // save dummy data
        const promises: Promise<Post>[] = [];
        for (let i = 0; i < 100; i++) {
            const post = new Post();
            post.id = i;
            post.title = "post #" + i;
            promises.push(connection.manager.save(post));
        }
        await Promise.all(promises);

        // check if they all are saved
        const loadedPosts = await connection.manager.find(Post);
        expect(loadedPosts).toBeInstanceOf(Array);
        expect(loadedPosts.length).toEqual(100);

        await connection.getRepository(Post).clear();

        // check find method
        const loadedPostsAfterClear = await connection.manager.find(Post);
        expect(loadedPostsAfterClear).toBeInstanceOf(Array);
        expect(loadedPostsAfterClear.length).toEqual(0);
    })));

    test("called from entity managed should remove everything as well", () => Promise.all(connections.map(async connection => {

        // save dummy data
        const promises: Promise<Post>[] = [];
        for (let i = 0; i < 100; i++) {
            const post = new Post();
            post.id = i;
            post.title = "post #" + i;
            promises.push(connection.manager.save(post));
        }
        await Promise.all(promises);

        // check if they all are saved
        const loadedPosts = await connection.manager.find(Post);
        expect(loadedPosts).toBeInstanceOf(Array);
        expect(loadedPosts.length).toEqual(100);

        await connection.manager.clear(Post);

        // check find method
        const loadedPostsAfterClear = await connection.manager.find(Post);
        expect(loadedPostsAfterClear).toBeInstanceOf(Array);
        expect(loadedPostsAfterClear.length).toEqual(0);
    })));

});
