import "reflect-metadata";
import {Post} from "./entity/Post";
import {Category} from "./entity/Category";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils";
import {Connection} from "../../../src";
import {PromiseUtils} from "../../../src";

describe("entity-model", () => {

    let connections: Connection[];
    beforeAll(async () => connections = await createTestingConnections({
        entities: [__dirname + "/entity/*{.js,.ts}"],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("should save successfully and use static methods successfully", () => PromiseUtils.runInSequence(connections, async connection => {
        Post.useConnection(connection); // change connection each time because of AR specifics

        const post = Post.create();
        post.title = "About ActiveRecord";
        post.text = "Huge discussion how good or bad ActiveRecord is.";
        await post.save();

        const loadedPost = await Post.findOne(post.id);

        expect(loadedPost)!.toBeInstanceOf(Post);
        expect(loadedPost!.id).toEqual(post.id);
        expect(loadedPost!.title).toEqual("About ActiveRecord");
        expect(loadedPost!.text).toEqual("Huge discussion how good or bad ActiveRecord is.");
    }));

    test("should reload given entity successfully", () => PromiseUtils.runInSequence(connections, async connection => {
        await connection.synchronize(true);
        Post.useConnection(connection);
        Category.useConnection(connection);

        const category = Category.create();
        category.id = 1;
        category.name = "Persistence";
        await category.save();

        const post = Post.create();
        post.title = "About ActiveRecord";
        post.categories = [category];
        await post.save();

        await post.reload();

        const assertCategory = Object.assign({}, post.categories[0]);
        expect(post)!.toBeInstanceOf(Post);
        expect(post!.id).toEqual(post.id);
        expect(post!.title).toEqual("About ActiveRecord");
        expect(post!.text).toEqual("This is default text.");
        expect(assertCategory).toEqual({
            id: 1,
            name: "Persistence"
        });

        category.name = "Persistence and Entity";
        await category.save();

        await post.reload();

        const assertReloadedCategory = Object.assign({}, post.categories[0]);
        expect(assertReloadedCategory).toEqual({
            id: 1,
            name: "Persistence and Entity"
        });

    }));

});
