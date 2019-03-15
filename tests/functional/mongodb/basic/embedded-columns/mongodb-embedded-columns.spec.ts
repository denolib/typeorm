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

describe("mongodb > embedded columns", () => {

    let connections: Connection[];
    beforeAll(async () => connections = await createTestingConnections({
        entities: [Post, Counters, Information],
        enabledDrivers: ["mongodb"],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("should insert / update / remove entity with embedded correctly", () => Promise.all(connections.map(async connection => {
        const postRepository = connection.getRepository(Post);

        // save few posts
        const post = new Post();
        post.title = "Post";
        post.text = "Everything about post";
        post.counters = new Counters();
        post.counters.likes = 5;
        post.counters.comments = 1;
        post.counters.favorites = 10;
        post.counters.information = new Information();
        post.counters.information.description = "Hello post";
        await postRepository.save(post);

        const loadedPost = await postRepository.findOne({ title: "Post" });

        expect(loadedPost).toBeDefined();
        expect(loadedPost!.counters).toBeDefined();
        expect(loadedPost!.counters.information).toBeDefined();
        expect(loadedPost)!.toBeInstanceOf(Post);
        expect(loadedPost!.title).toEqual("Post");
        expect(loadedPost!.text).toEqual("Everything about post");
        expect(loadedPost!.counters).toBeInstanceOf(Counters);
        expect(loadedPost!.counters.likes).toEqual(5);
        expect(loadedPost!.counters.comments).toEqual(1);
        expect(loadedPost!.counters.favorites).toEqual(10);
        expect(loadedPost!.counters.information).toBeInstanceOf(Information);
        expect(loadedPost!.counters.information.description).toEqual("Hello post");

        post.title = "Updated post";
        post.counters.comments = 2;
        post.counters.information.description = "Hello updated post";
        await postRepository.save(post);

        const loadedUpdatedPost = await postRepository.findOne({ title: "Updated post" });

        expect(loadedUpdatedPost).toBeDefined();
        expect(loadedUpdatedPost!.counters).toBeDefined();
        expect(loadedUpdatedPost!.counters.information).toBeDefined();
        expect(loadedUpdatedPost)!.toBeInstanceOf(Post);
        expect(loadedUpdatedPost!.title).toEqual("Updated post");
        expect(loadedUpdatedPost!.text).toEqual("Everything about post");
        expect(loadedUpdatedPost!.counters).toBeInstanceOf(Counters);
        expect(loadedUpdatedPost!.counters.likes).toEqual(5);
        expect(loadedUpdatedPost!.counters.comments).toEqual(2);
        expect(loadedUpdatedPost!.counters.favorites).toEqual(10);
        expect(loadedUpdatedPost!.counters.information).toBeInstanceOf(Information);
        expect(loadedUpdatedPost!.counters.information.description).toEqual("Hello updated post");

        await postRepository.remove(post);

        const removedPost = await postRepository.findOne({ title: "Post" });
        const removedUpdatedPost = await postRepository.findOne({ title: "Updated post" });
        expect(removedPost).toBeUndefined();
        expect(removedUpdatedPost).toBeUndefined();

    })));

    test("should store results in correct camelCase format", () => Promise.all(connections.map(async connection => {
        const postRepository = connection.getMongoRepository(Post);

        // save few posts
        const post = new Post();
        post.title = "Post";
        post.text = "Everything about post";
        post.counters = new Counters();
        post.counters.likes = 5;
        post.counters.comments = 1;
        post.counters.favorites = 10;
        post.counters.information = new Information();
        post.counters.information.description = "Hello post";
        await postRepository.save(post);

        const cursor = postRepository.createCursor();
        const loadedPost = await cursor.next();

        expect(loadedPost.title).toEqual("Post");
        expect(loadedPost.text).toEqual("Everything about post");
        expect(loadedPost.counters.likes).toEqual(5);
        expect(loadedPost.counters.comments).toEqual(1);
        expect(loadedPost.counters.favorites).toEqual(10);
        expect(loadedPost.counters.information.description).toEqual("Hello post");

    })));
});
