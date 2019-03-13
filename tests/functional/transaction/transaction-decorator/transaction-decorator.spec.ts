import "reflect-metadata";
import {Connection} from "../../../../src";
import {Post} from "./entity/Post";
import {PostController} from "./controller/PostController";
import {Category} from "./entity/Category";
import {
    closeTestingConnections,
    createTestingConnections,
    reloadTestingDatabases
} from "../../../../test/utils/test-utils";

describe("transaction > method wrapped into transaction decorator", () => {

    let connections: Connection[];
    beforeAll(async () => connections = await createTestingConnections({
        entities: [__dirname + "/entity/*{.js,.ts}"],
        enabledDrivers: ["mysql"] // since @Transaction accepts a specific connection name we can use only one connection and its name
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    // create a fake controller
    const controller = new PostController();

    test("should execute all operations in the method in a transaction", () => Promise.all(connections.map(async connection => {

        const post = new Post();
        post.title = "successfully saved post";

        const category = new Category();
        category.name = "successfully saved category";

        // call controller method
        await controller.save.apply(controller, [post, category]);

        // controller should have saved both post and category successfully
        const loadedPost = await connection.manager.findOne(Post, { where: { title: "successfully saved post" } });
        expect(loadedPost).not.toBeUndefined();
        expect(loadedPost!).toEqual(post);

        const loadedCategory = await connection.manager.findOne(Category, { where: { name: "successfully saved category" } });
        expect(loadedCategory).not.toBeUndefined();
        expect(loadedCategory!).toEqual(category);

    })));

    test("should rollback transaction if any operation in the method failed", () => Promise.all(connections.map(async connection => {

        const post = new Post();
        post.title = "successfully saved post";

        const category = new Category(); // this will fail because no name set

        // call controller method and make its rejected since controller action should fail
        let throwError: any;
        try {
            await controller.save.apply(controller, [post, category]);
        } catch (err) {
            throwError = err;
        }
        expect(throwError).not.toBeUndefined();

        const loadedPost = await connection.manager.findOne(Post, { where: { title: "successfully saved post" }});
        expect(loadedPost).toBeUndefined();

        const loadedCategory = await connection.manager.findOne(Category, { where: { name: "successfully saved category" }});
        expect(loadedCategory).toBeUndefined();

    })));

    test("should rollback transaction if any operation in the method failed", () => Promise.all(connections.map(async connection => {

        const post = new Post();  // this will fail because no title set

        const category = new Category();
        category.name = "successfully saved category";

        // call controller method and make its rejected since controller action should fail
        let throwError: any;
        try {
            await controller.save.apply(controller, [post, category]);
        } catch (err) {
            throwError = err;
        }
        expect(throwError).not.toBeUndefined();

        const loadedPost = await connection.manager.findOne(Post, { where: { title: "successfully saved post" }});
        expect(loadedPost).toBeUndefined();

        const loadedCategory = await connection.manager.findOne(Category, { where: { name: "successfully saved category" }});
        expect(loadedCategory).toBeUndefined();

    })));

    test("should save even if second operation failed in method not wrapped into @Transaction decorator", () => Promise.all(connections.map(async connection => {

        const post = new Post(); // this will be saved in any cases because its valid
        post.title = "successfully saved post";

        const category = new Category(); // this will fail because no name set

        // call controller method and make its rejected since controller action should fail
        let throwError: any;
        try {
            await controller.nonSafeSave.apply(controller, [connection.manager, post, category]);

        } catch (err) {
            throwError = err;
        }
        expect(throwError).not.toBeUndefined();

        // controller should have saved both post and category successfully
        const loadedPost = await connection.manager.findOne(Post, { where: { title: "successfully saved post" }});
        expect(loadedPost).not.toBeUndefined();
        expect(loadedPost!).toEqual(post);

        const loadedCategory = await connection.manager.findOne(Category, { where: { name: "successfully saved category" }});
        expect(loadedCategory).toBeUndefined();

    })));

    it("should inject repository and custom repository into method decorated with @Transaction", () => Promise.all(connections.map(async connection => {
        const post = new Post();
        post.title = "successfully saved post";

        const category = new Category();
        category.name = "successfully saved category";

        // call controller method
        const savedCategory = await controller.saveWithRepository.apply(controller, [post, category]);

        // controller should successfully call custom repository method and return the found entity
        expect(savedCategory).not.toBeUndefined();
        expect(savedCategory!).toEqual(category);

        // controller should have saved both post and category successfully
        const loadedPost = await connection.manager.findOne(Post, { where: { title: "successfully saved post" } });
        expect(loadedPost).not.toBeUndefined();
        expect(loadedPost!).toEqual(post);

        const loadedCategory = await connection.manager.findOne(Category, { where: { name: "successfully saved category" } });
        expect(loadedCategory).not.toBeUndefined();
        expect(loadedCategory!).toEqual(category);
    })));

    test("should execute all operations in the method in a transaction with a specified isolation", () => Promise.all(connections.map(async connection => {

        const post = new Post();
        post.title = "successfully saved post";

        const category = new Category();
        category.name = "successfully saved category";

        // call controller method
        await controller.saveWithNonDefaultIsolation.apply(controller, [post, category]);

        // controller should have saved both post and category successfully
        const loadedPost = await connection.manager.findOne(Post, { where: { title: "successfully saved post" } });
        expect(loadedPost).not.toBeUndefined();
        expect(loadedPost!).toEqual(post);

        const loadedCategory = await connection.manager.findOne(Category, { where: { name: "successfully saved category" } });
        expect(loadedCategory).not.toBeUndefined();
        expect(loadedCategory!).toEqual(category);

    })));

});
