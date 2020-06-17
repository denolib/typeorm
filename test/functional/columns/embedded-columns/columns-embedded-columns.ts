import {expect} from "../../../deps/chai.ts";
import {runIfMain} from "../../../deps/mocha.ts";
import {Connection} from "../../../../src/connection/Connection.ts";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../../utils/test-utils.ts";
import {Counters} from "./entity/Counters.ts";
import {SimplePost} from "./entity/SimplePost.ts";
import {SimpleCounters} from "./entity/SimpleCounters.ts";
import {Information} from "./entity/Information.ts";
import {Post} from "./entity/Post.ts";

describe("columns > embedded columns", () => {

    let connections: Connection[];
    before(async () => connections = await createTestingConnections({
        entities: [Counters, Information, Post, SimpleCounters, SimplePost],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("should insert / update / remove entity with embedded correctly", () => Promise.all(connections.map(async connection => {
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

        expect(loadedPost).to.be.not.empty;
        expect(loadedPost!.counters).to.be.not.empty;
        expect(loadedPost!.counters.information).to.be.not.empty;
        loadedPost!.should.be.instanceOf(SimplePost);
        loadedPost!.title.should.be.equal("Post");
        loadedPost!.text.should.be.equal("Everything about post");
        loadedPost!.counters.should.be.instanceOf(SimpleCounters);
        loadedPost!.counters.likes.should.be.equal(5);
        loadedPost!.counters.comments.should.be.equal(1);
        loadedPost!.counters.favorites.should.be.equal(10);
        loadedPost!.counters.information.should.be.instanceOf(Information);
        loadedPost!.counters.information.description.should.be.equal("Hello post");

        post.title = "Updated post";
        post.counters.comments = 2;
        post.counters.information.description = "Hello updated post";
        await postRepository.save(post);

        const loadedUpdatedPost = await postRepository.findOne({ title: "Updated post" });

        expect(loadedUpdatedPost).to.be.not.empty;
        expect(loadedUpdatedPost!.counters).to.be.not.empty;
        expect(loadedUpdatedPost!.counters.information).to.be.not.empty;
        loadedUpdatedPost!.should.be.instanceOf(SimplePost);
        loadedUpdatedPost!.title.should.be.equal("Updated post");
        loadedUpdatedPost!.text.should.be.equal("Everything about post");
        loadedUpdatedPost!.counters.should.be.instanceOf(SimpleCounters);
        loadedUpdatedPost!.counters.likes.should.be.equal(5);
        loadedUpdatedPost!.counters.comments.should.be.equal(2);
        loadedUpdatedPost!.counters.favorites.should.be.equal(10);
        loadedUpdatedPost!.counters.information.should.be.instanceOf(Information);
        loadedUpdatedPost!.counters.information.description.should.be.equal("Hello updated post");

        await postRepository.remove(post);

        const removedPost = await postRepository.findOne({ title: "Post" });
        const removedUpdatedPost = await postRepository.findOne({ title: "Updated post" });
        expect(removedPost).to.be.undefined;
        expect(removedUpdatedPost).to.be.undefined;
    })));

    it("should properly generate column names", () => Promise.all(connections.map(async connection => {
        const postRepository = connection.getRepository(Post);
        const columns = postRepository.metadata.columns;
        const databaseColumns = columns.map(c => c.databaseName);

        expect(databaseColumns).to.have.members([
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
        ]);
    })));
});

runIfMain(import.meta);
