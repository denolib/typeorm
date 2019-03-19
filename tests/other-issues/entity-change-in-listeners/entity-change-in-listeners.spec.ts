import "reflect-metadata";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils";
import {Connection} from "../../../src";
import {Post} from "./entity/Post";

describe("other issues > entity change in listeners should affect persistence", () => {

    let connections: Connection[];
    beforeAll(async () => connections = await createTestingConnections({
        entities: [__dirname + "/entity/*{.js,.ts}"],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("if entity was changed in the listener, changed property should be updated in the db", () => Promise.all(connections.map(async function(connection) {

        // insert a post
        const post = new Post();
        post.title = "hello";
        await connection.manager.save(post);

        // check if it was inserted correctly
        const loadedPost = await connection.manager.findOne(Post);
        expect(loadedPost).not.toBeUndefined();
        expect(loadedPost!.title).toEqual("hello");

        // now update some property and let update listener trigger
        loadedPost!.active = true;
        await connection.manager.save(loadedPost!);

        // check if update listener was triggered and entity was really updated by the changes in the listener
        const loadedUpdatedPost = await connection.manager.findOne(Post);

        expect(loadedUpdatedPost).not.toBeUndefined();
        expect(loadedUpdatedPost!.title).toEqual("hello!");

        await connection.manager.save(loadedPost!);
        await connection.manager.save(loadedPost!);
        await connection.manager.save(loadedPost!);
        await connection.manager.save(loadedPost!);

    })));

});
