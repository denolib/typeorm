import "reflect-metadata";
import {Connection} from "../../../../src";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../../utils/test-utils";
import {SimplePost} from "./entity/SimplePost";
import {SimpleCounters} from "./entity/SimpleCounters";
import {Information} from "./entity/Information";
import {Post} from "./entity/Post";

describe("columns > embedded columns", () => {

    let connections: Connection[];
    beforeAll(async () => connections = await createTestingConnections({
        entities: [__dirname + "/entity/*{.js,.ts}"],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("should insert / update / remove entity with embedded correctly", () => Promise.all(connections.map(async connection => {
        const postRepository = connection.getRepository(SimplePost);

        // save few posts
        const post = new SimplePost();
        post.title = "Post";
        post.text = "Everything about post";
        post.counters = new SimpleCounters();
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
        expect(loadedPost)!.toBeInstanceOf(SimplePost);
        expect(loadedPost!.title).toEqual("Post");
        expect(loadedPost!.text).toEqual("Everything about post");
        expect(loadedPost!.counters).toBeInstanceOf(SimpleCounters);
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
        expect(loadedUpdatedPost)!.toBeInstanceOf(SimplePost);
        expect(loadedUpdatedPost!.title).toEqual("Updated post");
        expect(loadedUpdatedPost!.text).toEqual("Everything about post");
        expect(loadedUpdatedPost!.counters).toBeInstanceOf(SimpleCounters);
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

    it("should properly generate column names", () => Promise.all(connections.map(async connection => {
        const postRepository = connection.getRepository(Post);
        const columns = postRepository.metadata.columns;
        const databaseColumns = columns.map(c => c.databaseName);

        expect(databaseColumns).toEqual(expect.arrayContaining([
            // Post
            // Post.id
            "id",
            // Post.title
            "title",
            // Post.text
            "text",

            // Post.counters()
            // Post.counters().likes
            "countersLikes",
            // Post.counters().comments
            "countersComments",
            // Post.counters().favorites
            "countersFavorites",
            // Post.counters().information('info').description
            "countersInfoDescr",
            // Post.counters().otherCounters('testData').description
            "countersTestDataDescr",
            // Post.counters().dataWithoutPrefix('').description
            "countersDescr",

            // Post.otherCounters('testCounters')
            // Post.otherCounters('testCounters').likes
            "testCountersLikes",
            // Post.otherCounters('testCounters').comments
            "testCountersComments",
            // Post.otherCounters('testCounters').favorites
            "testCountersFavorites",
            // Post.otherCounters('testCounters').information('info').description
            "testCountersInfoDescr",
            // Post.otherCounters('testCounters').data('data').description
            "testCountersTestDataDescr",
            // Post.otherCounters('testCounters').dataWithoutPrefix('').description
            "testCountersDescr",

            // Post.countersWithoutPrefix('')
            // Post.countersWithoutPrefix('').likes
            "likes",
            // Post.countersWithoutPrefix('').comments
            "comments",
            // Post.countersWithoutPrefix('').favorites
            "favorites",
            // Post.countersWithoutPrefix('').information('info').description
            "infoDescr",
            // Post.countersWithoutPrefix('').data('data').description
            "testDataDescr",
            // Post.countersWithoutPrefix('').dataWithoutPrefix('').description
            "descr"
        ]));
    })));
});
