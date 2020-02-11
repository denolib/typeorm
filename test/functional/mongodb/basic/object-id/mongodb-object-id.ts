import { Connection } from "../../../../../src/connection/Connection.ts";
import { closeTestingConnections, createTestingConnections, reloadTestingDatabases } from "../../../../utils/test-utils.ts";
import { Post } from "./entity/Post.ts";
import { PostWithUnderscoreId } from "./entity/PostWithUnderscoreId.ts";
import { expect } from "../../../../deps/chai.ts";
import { runIfMain } from "../../../../deps/mocha.ts";


// TODO(uki00a) Remove `.skip` when MongoDriver is implemented.
describe.skip("mongodb > object id columns", () => {

    let connections: Connection[];
    before(async () => connections = await createTestingConnections({
        entities: [Post, PostWithUnderscoreId],
        enabledDrivers: ["mongodb"]
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("should persist ObjectIdColumn property as _id to DB", () => Promise.all(connections.map(async connection => {
        const postMongoRepository = connection.getMongoRepository(Post);

        // save a post
        const post = new Post();
        post.title = "Post";
        await postMongoRepository.save(post);

        // little hack to get raw data from mongodb
        const aggArr = await postMongoRepository.aggregate([]).toArray();

        expect(aggArr[0]._id).to.be.not.undefined;
        expect(aggArr[0].nonIdNameOfObjectId).to.be.undefined;
    })));


    it("should map _id to ObjectIdColumn property and remove BD _id property", () => Promise.all(connections.map(async connection => {
        const postMongoRepository = connection.getMongoRepository(Post);

        // save a post
        const post = new Post();
        post.title = "Post";
        await postMongoRepository.save(post);

        expect(post.nonIdNameOfObjectId).to.be.not.undefined;
        expect((post as any)._id).to.be.undefined;
    })));


    it("should save and load properly if objectId property has name _id", () => Promise.all(connections.map(async connection => {
        const postMongoRepository = connection.getMongoRepository(PostWithUnderscoreId);

        // save a post
        const post = new PostWithUnderscoreId();
        post.title = "Post";
        await postMongoRepository.save(post);

        expect(post._id).to.be.not.undefined;

        const loadedPost = await postMongoRepository.findOne(post._id);
        expect(loadedPost!._id).to.be.not.undefined;
    })));


    it("should not persist entity ObjectIdColumn property in DB on update by save", () => Promise.all(connections.map(async connection => {
        const postMongoRepository = connection.getMongoRepository(Post);

        // save a post
        const post = new Post();
        post.title = "Post";
        await postMongoRepository.save(post);

        post.title = "Muhaha changed title";

        await postMongoRepository.save(post);

        expect(post.nonIdNameOfObjectId).to.be.not.undefined;
        expect((post as any)._id).to.be.undefined;

        // little hack to get raw data from mongodb
        const aggArr = await postMongoRepository.aggregate([]).toArray();

        expect(aggArr[0]._id).to.be.not.undefined;
        expect(aggArr[0].nonIdNameOfObjectId).to.be.undefined;
    })));

});

runIfMain(import.meta);
