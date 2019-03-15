import "reflect-metadata";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../../test/utils/test-utils";
import {Connection} from "../../../src";
import {Post} from "./entity/Post";

describe("other issues > preventing-injection", () => {

    let connections: Connection[];
    beforeAll(async () => connections = await createTestingConnections({
        entities: [__dirname + "/entity/*{.js,.ts}"],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("should not allow selection of non-exist columns via FindOptions", () => Promise.all(connections.map(async function(connection) {
        const post = new Post();
        post.title = "hello";
        await connection.manager.save(post);

        const postWithOnlyIdSelected = await connection.manager.find(Post, {
            select: ["id"]
        });
        expect(postWithOnlyIdSelected).toEqual([{ id: 1 }]);

        await expect(connection.manager.find(Post, {
            select: ["(WHERE LIMIT 1)" as any]
        })).rejects.toBeDefined();
    })));

    test("should skip non-exist columns in where expression via FindOptions", () => Promise.all(connections.map(async function(connection) {
        const post = new Post();
        post.title = "hello";
        await connection.manager.save(post);

        const postWithOnlyIdSelected = await connection.manager.find(Post, {
            where: {
                title: "hello"
            }
        });
        expect(postWithOnlyIdSelected).toEqual([{ id: 1, title: "hello" }]);

        const loadedPosts = await connection.manager.find(Post, {
            where: {
                id: 2,
                ["(WHERE LIMIT 1)"]: "hello"
            }
        });
        expect(loadedPosts).toEqual([]);
    })));

    test("should not allow selection of non-exist columns via FindOptions", () => Promise.all(connections.map(async function(connection) {
        const post = new Post();
        post.title = "hello";
        await connection.manager.save(post);

        const loadedPosts = await connection.manager.find(Post, {
            order: {
                title: "DESC"
            }
        });
        expect(loadedPosts).toEqual([{ id: 1, title: "hello" }]);

        await expect(
            connection
                .manager
                .find(Post, {
                    order: { ["(WHERE LIMIT 1)" as any]: "DESC" }
                })
        ).rejects.toBeDefined();

    })));

    test("should not allow non-numeric values in skip and take via FindOptions", () => Promise.all(connections.map(async function(connection) {

        await expect(
            connection
                .manager
                .find(Post, {take: "(WHERE XXX)" as any})
        ).rejects.toBeDefined();

        await expect(
            connection
                .manager
                .find(Post, {
                    skip: "(WHERE LIMIT 1)" as any,
                    take: "(WHERE XXX)" as any
                })
        ).rejects.toBeDefined();

    })));

    test("should not allow non-numeric values in skip and take in QueryBuilder", () => Promise.all(connections.map(async function(connection) {

        expect(() => {
            connection.manager
                .createQueryBuilder(Post, "post")
                .take("(WHERE XXX)" as any);
        }).toThrow(Error);

        expect(() => {
            connection.manager
                .createQueryBuilder(Post, "post")
                .skip("(WHERE LIMIT 1)" as any);
        }).toThrow(Error);

    })));

    test("should not allow non-allowed values in order by in QueryBuilder", () => Promise.all(connections.map(async function(connection) {

        expect(() => {
            connection.manager
                .createQueryBuilder(Post, "post")
                .orderBy("post.id", "MIX" as any);
        }).toThrow(Error);

        expect(() => {
            connection.manager
                .createQueryBuilder(Post, "post")
                .orderBy("post.id", "DESC", "SOMETHING LAST" as any);
        }).toThrow(Error);

    })));

});
