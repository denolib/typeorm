import "reflect-metadata";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../../test/utils/test-utils";
import {Connection} from "../../../src";
import {Post} from "./entity/Post";

describe("github issues > #3256 wrong subscriber methods being called", () => {

    let connections: Connection[];
    beforeAll(async () => connections = await createTestingConnections({
        entities: [__dirname + "/entity/*{.js,.ts}"],
        subscribers: [__dirname + "/subscriber/*{.js,.ts}"],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("if entity was changed, subscriber should be take updated columns", () => Promise.all(connections.map(async function(connection) {

        const post = new Post();
        post.id = 1;
        post.title = "hello world";
        await connection.manager.save(post);

        expect(post.inserted).toEqual(true);
        expect(post.updated).toEqual(false);

        const loadedPost = await connection.getRepository(Post).findOne(1);
        loadedPost!.title = "updated world";
        await connection.manager.save(loadedPost);

        expect(loadedPost!.inserted).toEqual(false);
        expect(loadedPost!.updated).toEqual(true);

    })));

});
