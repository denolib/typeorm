import {Connection} from "../../../../../src/connection/Connection.ts";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../../../utils/test-utils.ts";
import {Post} from "./entity/Post.ts";
import {Counters} from "./entity/Counters.ts";
import {Information} from "./entity/Information.ts";
import {expect} from "../../../../deps/chai.ts";
import {runIfMain} from "../../../../deps/mocha.ts";

// TODO(uki00a) Remove `.skip` when MongoDriver is implemented.
describe.skip("mongodb > embedded columns listeners", () => {

    let connections: Connection[];
    before(async () => connections = await createTestingConnections({
        entities: [Post, Counters, Information],
        enabledDrivers: ["mongodb"],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("should work listeners in entity embeddeds correctly", () => Promise.all(connections.map(async connection => {
        const postRepository = connection.getRepository(Post);

        // save posts with embeddeds
        const post = new Post();
        post.title = "Post";
        post.text = "Everything about post";
        post.counters = new Counters();
        post.counters.information = new Information();
        await postRepository.save(post);

        const loadedPost = await postRepository.findOne({title: "Post"});

        expect(loadedPost).to.be.not.empty;
        expect(loadedPost!.counters).to.be.not.empty;
        expect(loadedPost!.counters!.information).to.be.not.empty;
        loadedPost!.should.be.instanceOf(Post);
        loadedPost!.title.should.be.equal("Post");
        loadedPost!.text.should.be.equal("Everything about post");

        post.title = "Updated post";
        await postRepository.save(post);

        const loadedUpdatedPost = await postRepository.findOne({title: "Updated post"});

        expect(loadedUpdatedPost).to.be.not.empty;
        expect(loadedUpdatedPost!.counters).to.be.not.empty;
        expect(loadedUpdatedPost!.counters!.likes).to.be.eq(100);
        expect(loadedUpdatedPost!.counters!.information!.comments).to.be.eq(1);
        expect(loadedUpdatedPost!.counters!.information!.description).to.be.not.empty;
        loadedUpdatedPost!.should.be.instanceOf(Post);
        loadedUpdatedPost!.title.should.be.equal("Updated post");
        loadedUpdatedPost!.text.should.be.equal("Everything about post");

        await postRepository.remove(post);

    })));

    it("should not work listeners in entity embeddeds if property is optional", () => Promise.all(connections.map(async connection => {
        const postRepository = connection.getMongoRepository(Post);

        // save posts without embeddeds
        const post = new Post();
        post.title = "Post";
        post.text = "Everything about post";
        await postRepository.save(post);

        const cursor = postRepository.createCursor();
        const loadedPost = await cursor.next();

        loadedPost.title.should.be.eql("Post");
        loadedPost.text.should.be.eql("Everything about post");

    })));
});

runIfMain(import.meta);
