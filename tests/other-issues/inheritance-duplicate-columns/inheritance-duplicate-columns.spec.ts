import "reflect-metadata";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../../test/utils/test-utils";
import {Connection} from "../../../src";
import {Post} from "./entity/Post";

describe("other issues > double inheritance produces multiple duplicated columns", () => {

    let connections: Connection[];
    beforeAll(async () => connections = await createTestingConnections({
        entities: [__dirname + "/entity/*{.js,.ts}"],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("should not produce duplicate columns", () => Promise.all(connections.map(async function(connection) {

        // insert a post
        const post = new Post();
        post.title = "hello";
        await connection.manager.save(post);

        // check if it was inserted correctly
        const loadedPost = await connection.manager.findOne(Post);
        expect(loadedPost).not.toBeUndefined();
        expect(loadedPost!.title).toEqual("hello");

    })));

});
