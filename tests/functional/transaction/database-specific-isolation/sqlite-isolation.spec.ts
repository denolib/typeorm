import "reflect-metadata";
import {Connection} from "../../../../src";
import {Post} from "./entity/Post";
import {Category} from "./entity/Category";
import {
    closeTestingConnections,
    createTestingConnections,
    reloadTestingDatabases
} from "../../../utils/test-utils";

describe("transaction > transaction with sqlite connection partial isolation support", () => {

    let connections: Connection[];
    beforeAll(async () => connections = await createTestingConnections({
        entities: [__dirname + "/entity/*{.js,.ts}"],
        enabledDrivers: ["sqlite"] // todo: for some reasons mariadb tests are not passing here
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("should execute all operations in a single transaction with READ UNCOMMITTED isolation level", () => Promise.all(connections.map(async connection => {

        let postId: number|undefined = undefined, categoryId: number|undefined = undefined;

        await connection.manager.transaction("READ UNCOMMITTED", async entityManager => {

            const post = new Post();
            post.title = "Post #1";
            await entityManager.save(post);

            const category = new Category();
            category.name = "Category #1";
            await entityManager.save(category);

            postId = post.id;
            categoryId = category.id;

        });

        const post = await connection.manager.findOne(Post, { where: { title: "Post #1" }});
        expect(post).not.toBeUndefined();
        expect(post!).toEqual({
            id: postId,
            title: "Post #1"
        });

        const category = await connection.manager.findOne(Category, { where: { name: "Category #1" }});
        expect(category).not.toBeUndefined();
        expect(category!).toEqual({
            id: categoryId,
            name: "Category #1"
        });

    })));

    test("should execute all operations in a single transaction with SERIALIZABLE isolation level", () => Promise.all(connections.map(async connection => {

        let postId: number|undefined = undefined, categoryId: number|undefined = undefined;

        await connection.manager.transaction("SERIALIZABLE", async entityManager => {

            const post = new Post();
            post.title = "Post #1";
            await entityManager.save(post);

            const category = new Category();
            category.name = "Category #1";
            await entityManager.save(category);

            postId = post.id;
            categoryId = category.id;

        });

        const post = await connection.manager.findOne(Post, { where: { title: "Post #1" }});
        expect(post).not.toBeUndefined();
        expect(post!).toEqual({
            id: postId,
            title: "Post #1"
        });

        const category = await connection.manager.findOne(Category, { where: { name: "Category #1" }});
        expect(category).not.toBeUndefined();
        expect(category!).toEqual({
            id: categoryId,
            name: "Category #1"
        });

    })));
});
