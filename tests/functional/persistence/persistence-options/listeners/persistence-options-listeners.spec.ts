import "reflect-metadata";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../../../../test/utils/test-utils";
import {Post} from "./entity/Post";
import {Connection} from "../../../../../src";

describe("persistence > persistence options > listeners", () => {

    // -------------------------------------------------------------------------
    // Configuration
    // -------------------------------------------------------------------------

    let connections: Connection[];
    beforeAll(async () => connections = await createTestingConnections({ __dirname }));
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    // -------------------------------------------------------------------------
    // Specifications
    // -------------------------------------------------------------------------

    test("save listeners should work by default", () => Promise.all(connections.map(async connection => {
        const post = new Post();
        post.title = "Bakhrom";
        post.description = "Hello";
        await connection.manager.save(post);
        expect(post.title).toEqual("Bakhrom!");
    })));

    test("save listeners should be disabled if save option is specified", () => Promise.all(connections.map(async connection => {
        const post = new Post();
        post.title = "Bakhrom";
        post.description = "Hello";
        await connection.manager.save(post, { listeners: false });
        expect(post.title).toEqual("Bakhrom");
    })));

    test("remove listeners should work by default", () => Promise.all(connections.map(async connection => {
        const post = new Post();
        post.title = "Bakhrom";
        post.description = "Hello";
        await connection.manager.save(post);
        await connection.manager.remove(post);
        expect(post.isRemoved).toEqual(true);
    })));

    test("remove listeners should be disabled if remove option is specified", () => Promise.all(connections.map(async connection => {
        const post = new Post();
        post.title = "Bakhrom";
        post.description = "Hello";
        await connection.manager.save(post);
        await connection.manager.remove(post, { listeners: false });
        expect(post.isRemoved).toEqual(false);
    })));

});
