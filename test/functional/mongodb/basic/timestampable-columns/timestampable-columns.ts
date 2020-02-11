import {Connection} from "../../../../../src/connection/Connection.ts";
import {
    closeTestingConnections,
    createTestingConnections,
    reloadTestingDatabases
} from "../../../../utils/test-utils.ts";
import {Post} from "./entity/Post.ts";
import {expect} from "../../../../deps/chai.ts";
import {runIfMain} from "../../../../deps/mocha.ts";

// TODO(uki00a) Remove `.skip` when MongoDriver is implemented.
describe.skip("mongodb > timestampable columns", () => {

    let connections: Connection[];
    before(async () => connections = await createTestingConnections({
        entities: [Post],
        enabledDrivers: ["mongodb"]
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("should persist timestampable columns", () => Promise.all(connections.map(async connection => {
        const commentMongoRepository = connection.getMongoRepository(Post);

        // save a post
        const post = new Post();
        post.message = "Hello";
        await commentMongoRepository.save(post);
        expect(post.id).to.be.not.undefined;
        post.createdAt.should.be.instanceof(Date);
        const createdAt = post.createdAt;

        post.updatedAt.should.be.instanceof(Date);
        const updatedAt = post.updatedAt;

        // test has +/- delta range of 5 milliseconds, because earlier this test fell due to the difference of 1 millisecond
        expect(post.updatedAt.getTime() - post.createdAt.getTime()).to.be.closeTo(0, 5);

        // update
        const date = new Date();
        date.setFullYear(2001);

        post.message = "New message";
        post.createdAt = date;
        post.updatedAt = date;

        await commentMongoRepository.save(post);

        const updatedPost = await commentMongoRepository.findOne(post.id);

        expect(updatedPost).to.be.ok;

        expect((updatedPost as Post).createdAt.getTime()).to.equal(createdAt.getTime());
        expect((updatedPost as Post).updatedAt.getTime()).to.gte(updatedAt.getTime());
    })));

});

runIfMain(import.meta);
