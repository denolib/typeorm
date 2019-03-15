import "reflect-metadata";
import {Connection} from "../../../../../src";
import {Post} from "./entity/Post";
import {MongoRepository} from "../../../../../src";
import {
    closeTestingConnections,
    createTestingConnections,
    reloadTestingDatabases
} from "../../../../../test/utils/test-utils";

describe("mongodb > MongoRepository", () => {

    let connections: Connection[];
    beforeAll(async () => connections = await createTestingConnections({
        entities: [Post],
        enabledDrivers: ["mongodb"]
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("connection should return mongo repository when requested", () => Promise.all(connections.map(async connection => {
        const postRepository = connection.getMongoRepository(Post);
        expect(postRepository).toBeInstanceOf(MongoRepository);
    })));

    test("entity manager should return mongo repository when requested", () => Promise.all(connections.map(async connection => {
        const postRepository = connection.manager.getMongoRepository(Post);
        expect(postRepository).toBeInstanceOf(MongoRepository);
    })));

    test("should be able to use entity cursor which will return instances of entity classes", () => Promise.all(connections.map(async connection => {
        const postRepository = connection.getMongoRepository(Post);

        // save few posts
        const firstPost = new Post();
        firstPost.title = "Post #1";
        firstPost.text = "Everything about post #1";
        await postRepository.save(firstPost);

        const secondPost = new Post();
        secondPost.title = "Post #2";
        secondPost.text = "Everything about post #2";
        await postRepository.save(secondPost);

        const cursor = postRepository.createEntityCursor({
            title: "Post #1"
        });

        const loadedPosts = await cursor.toArray();
        expect(loadedPosts.length).toEqual(1);
        expect(loadedPosts[0]).toBeInstanceOf(Post);
        expect(loadedPosts[0].id).toEqual(firstPost.id);
        expect(loadedPosts[0].title).toEqual("Post #1");
        expect(loadedPosts[0].text).toEqual("Everything about post #1");

    })));

    test("should be able to use entity cursor which will return instances of entity classes", () => Promise.all(connections.map(async connection => {
        const postRepository = connection.getMongoRepository(Post);

        // save few posts
        const firstPost = new Post();
        firstPost.title = "Post #1";
        firstPost.text = "Everything about post #1";
        await postRepository.save(firstPost);

        const secondPost = new Post();
        secondPost.title = "Post #2";
        secondPost.text = "Everything about post #2";
        await postRepository.save(secondPost);

        const loadedPosts = await postRepository.find({
            where: {
                $or: [
                    {
                        title: "Post #1",
                    },
                    {
                        text: "Everything about post #1"
                    }
                ]
            }
        });

        expect(loadedPosts.length).toEqual(1);
        expect(loadedPosts[0]).should.be.instanceOf(Post);
        expect(loadedPosts[0].id).toEqual(firstPost.id);
        expect(loadedPosts[0].title).toEqual("Post #1");
        expect(loadedPosts[0].text).toEqual("Everything about post #1");

    })));

    // todo: cover other methods as well

});
