import "reflect-metadata";
import { Connection } from "../../../../../src";
import { Post } from "./entity/Post";
import { PostWithUnderscoreId } from "./entity/PostWithUnderscoreId";
import {
    closeTestingConnections,
    createTestingConnections,
    reloadTestingDatabases
} from "../../../../utils/test-utils";


describe("mongodb > object id columns", () => {

    let connections: Connection[];
    beforeAll(async () => connections = await createTestingConnections({
        entities: [Post, PostWithUnderscoreId],
        enabledDrivers: ["mongodb"]
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("should persist ObjectIdColumn property as _id to DB", () => Promise.all(connections.map(async connection => {
        const postMongoRepository = connection.getMongoRepository(Post);

        // save a post
        const post = new Post();
        post.title = "Post";
        await postMongoRepository.save(post);

        // little hack to get raw data from mongodb
        const aggArr = await postMongoRepository.aggregate([]).toArray();

        expect(aggArr[0]._id).toBeDefined();
        expect(aggArr[0].nonIdNameOfObjectId).toBeUndefined();
    })));


    test("should map _id to ObjectIdColumn property and remove BD _id property", () => Promise.all(connections.map(async connection => {
        const postMongoRepository = connection.getMongoRepository(Post);

        // save a post
        const post = new Post();
        post.title = "Post";
        await postMongoRepository.save(post);

        expect(post.nonIdNameOfObjectId).toBeDefined();
        expect((post as any)._id).toBeUndefined();
    })));


    test("should save and load properly if objectId property has name _id", () => Promise.all(connections.map(async connection => {
        const postMongoRepository = connection.getMongoRepository(PostWithUnderscoreId);

        // save a post
        const post = new PostWithUnderscoreId();
        post.title = "Post";
        await postMongoRepository.save(post);

        expect(post._id).toBeDefined();

        const loadedPost = await postMongoRepository.findOne(post._id);
        expect(loadedPost!._id).toBeDefined();
    })));


    test("should not persist entity ObjectIdColumn property in DB on update by save", () => Promise.all(connections.map(async connection => {
        const postMongoRepository = connection.getMongoRepository(Post);

        // save a post
        const post = new Post();
        post.title = "Post";
        await postMongoRepository.save(post);

        post.title = "Muhaha changed title";

        await postMongoRepository.save(post);

        expect(post.nonIdNameOfObjectId).toBeDefined();
        expect((post as any)._id).toBeUndefined();

        // little hack to get raw data from mongodb
        const aggArr = await postMongoRepository.aggregate([]).toArray();

        expect(aggArr[0]._id).toBeDefined();
        expect(aggArr[0].nonIdNameOfObjectId).toBeUndefined();
    })));

});
