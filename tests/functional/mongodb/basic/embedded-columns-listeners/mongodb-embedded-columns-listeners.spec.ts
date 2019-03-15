import "reflect-metadata";
import {Connection} from "../../../../../src";
import {Post} from "./entity/Post";
import {Counters} from "./entity/Counters";
import {Information} from "./entity/Information";
import {
    closeTestingConnections,
    createTestingConnections,
    reloadTestingDatabases
} from "../../../../../test/utils/test-utils";

describe("mongodb > embedded columns listeners", () => {

    let connections: Connection[];
    beforeAll(async () => connections = await createTestingConnections({
        entities: [Post, Counters, Information],
        enabledDrivers: ["mongodb"],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("should work listeners in entity embeddeds correctly", () => Promise.all(connections.map(async connection => {
        const postRepository = connection.getRepository(Post);

        // save posts with embeddeds
        const post = new Post();
        post.title = "Post";
        post.text = "Everything about post";
        post.counters = new Counters();
        post.counters.information = new Information();
        await postRepository.save(post);

        const loadedPost = await postRepository.findOne({title: "Post"});

        expect(loadedPost).toBeDefined();
        expect(loadedPost!.counters).toBeDefined();
        expect(loadedPost!.counters!.information).toBeDefined();
        expect(loadedPost)!.toBeInstanceOf(Post);
        expect(loadedPost!.title).toEqual("Post");
        expect(loadedPost!.text).toEqual("Everything about post");

        post.title = "Updated post";
        await postRepository.save(post);

        const loadedUpdatedPost = await postRepository.findOne({title: "Updated post"});

        expect(loadedUpdatedPost).toBeDefined();
        expect(loadedUpdatedPost!.counters).toBeDefined();
        expect(loadedUpdatedPost!.counters!.likes).toEqual(100);
        expect(loadedUpdatedPost!.counters!.information!.comments).toEqual(1);
        expect(loadedUpdatedPost!.counters!.information!.description).toBeDefined();
        expect(loadedUpdatedPost)!.toBeInstanceOf(Post);
        expect(loadedUpdatedPost!.title).toEqual("Updated post");
        expect(loadedUpdatedPost!.text).toEqual("Everything about post");

        await postRepository.remove(post);

    })));

    test("should not work listeners in entity embeddeds if property is optional", () => Promise.all(connections.map(async connection => {
        const postRepository = connection.getMongoRepository(Post);

        // save posts without embeddeds
        const post = new Post();
        post.title = "Post";
        post.text = "Everything about post";
        await postRepository.save(post);

        const cursor = postRepository.createCursor();
        const loadedPost = await cursor.next();

        expect(loadedPost.title).toEqual("Post");
        expect(loadedPost.text).toEqual("Everything about post");

    })));
});
