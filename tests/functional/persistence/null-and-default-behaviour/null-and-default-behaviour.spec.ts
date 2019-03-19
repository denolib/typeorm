import "reflect-metadata";
import {Connection} from "../../../../src";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../../utils/test-utils";
import {Post} from "./entity/Post";

describe("persistence > null and default behaviour", () => {

    let connections: Connection[];
    beforeAll(async () => connections = await createTestingConnections({
        entities: [__dirname + "/entity/*{.js,.ts}"],

    }));
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("should insert value if it is set", () => Promise.all(connections.map(async connection => {

        // create category
        const post = new Post();
        post.id = 1;
        post.title = "Category saved!";
        await connection.manager.save(post);

        const loadedPost = await connection.manager.findOne(Post, 1);
        expect(loadedPost).toBeDefined();
        expect(loadedPost)!.toEqual({
            id: 1,
            title: "Category saved!"
        });

    })));

    test("should insert default when post.title is undefined", () => Promise.all(connections.map(async connection => {

        // create category
        const post = new Post();
        post.id = 1;
        await connection.manager.save(post);

        const loadedPost = await connection.manager.findOne(Post, 1);
        expect(loadedPost).toBeDefined();
        expect(loadedPost)!.toEqual({
            id: 1,
            title: "hello default value"
        });

    })));

    test("should insert NULL when post.title is null", () => Promise.all(connections.map(async connection => {

        // create category
        const post = new Post();
        post.id = 1;
        post.title = null;
        await connection.manager.save(post);

        const loadedPost = await connection.manager.findOne(Post, 1);
        expect(loadedPost).toBeDefined();
        expect(loadedPost)!.toEqual({
            id: 1,
            title: null
        });

    })));

    test("should update nothing when post.title is undefined", () => Promise.all(connections.map(async connection => {

        // create category
        const post = new Post();
        post.id = 1;
        post.title = "Category saved!";
        await connection.manager.save(post);

        post.title = undefined;
        await connection.manager.save(post);

        const loadedPost = await connection.manager.findOne(Post, 1);
        expect(loadedPost).toBeDefined();
        expect(loadedPost)!.toEqual({
            id: 1,
            title: "Category saved!"
        });

    })));

    test("should update to null when post.title is null", () => Promise.all(connections.map(async connection => {

        const post = new Post();
        post.id = 1;
        post.title = "Category saved!";
        await connection.manager.save(post);

        post.title = null;
        await connection.manager.save(post);

        const loadedPost = await connection.manager.findOne(Post, 1);
        expect(loadedPost).toBeDefined();
        expect(loadedPost)!.toEqual({
            id: 1,
            title: null
        });

    })));

});
