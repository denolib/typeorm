import {Connection} from "../../../../../src/connection/Connection.ts";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../../../utils/test-utils.ts";
import {Post} from "./entity/Post.ts";
import {expect} from "../../../../deps/chai.ts";
import {runIfMain} from "../../../../deps/mocha.ts";

// TODO(uki00a) Remove `.skip` when MongoDriver is implemented.
describe.skip("mongodb > indices", () => {

    let connections: Connection[];
    before(async () => connections = await createTestingConnections({
        entities: [Post],
        enabledDrivers: ["mongodb"]
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("should insert entity with indices correctly", () => Promise.all(connections.map(async connection => {
        const postRepository = connection.getRepository(Post);

        // save a post
        const post = new Post();
        post.title = "Post";
        post.name = "About Post";
        await postRepository.save(post);

        // check saved post
        const loadedPost = await postRepository.findOne({ title: "Post" });

        expect(loadedPost).to.be.not.empty;
    })));

});

runIfMain(import.meta);
