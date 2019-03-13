import "reflect-metadata";
import {Connection} from "../../../../src";
import {Post} from "./entity/Post";
import {Category} from "./entity/Category";
import {
    closeTestingConnections,
    createTestingConnections,
    reloadTestingDatabases
} from "../../../../test/utils/test-utils";

describe("transaction > transaction with entity manager", () => {

    let connections: Connection[];
    beforeAll(async () => connections = await createTestingConnections({
        entities: [__dirname + "/entity/*{.js,.ts}"],
        enabledDrivers: ["mysql", "sqlite", "postgres"] // todo: for some reasons mariadb tests are not passing here
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("should execute all operations in a single transaction", () => Promise.all(connections.map(async connection => {

        let postId: number|undefined = undefined, categoryId: number|undefined = undefined;

        await connection.manager.transaction(async entityManager => {

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

    test("should not save anything if any of operation in transaction fail", () => Promise.all(connections.map(async connection => {

        let postId: number|undefined = undefined, categoryId: number|undefined = undefined;

        try {
            await connection.manager.transaction(async entityManager => {

                const post = new Post();
                post.title = "Post #1";
                await entityManager.save(post);

                const category = new Category();
                category.name = "Category #1";
                await entityManager.save(category);

                postId = post.id;
                categoryId = category.id;

                const loadedPost = await entityManager.findOne(Post, { where: { title: "Post #1" }});
                expect(loadedPost).not.toBeUndefined();
                expect(loadedPost!).toEqual({
                    id: postId,
                    title: "Post #1"
                });

                const loadedCategory = await entityManager.findOne(Category, { where: { name: "Category #1" }});
                expect(loadedCategory).not.toBeUndefined();
                expect(loadedCategory!).toEqual({
                    id: categoryId,
                    name: "Category #1"
                });

                // now try to save post without title - it will fail and transaction will be reverted
                const wrongPost = new Post();
                await entityManager.save(wrongPost);

            });
        } catch (err) {
            /* skip error */
        }

        const post = await connection.manager.findOne(Post, { where: { title: "Post #1" }});
        expect(post).toBeUndefined();

        const category = await connection.manager.findOne(Category, { where: { name: "Category #1" }});
        expect(category).toBeUndefined();

    })));

});
