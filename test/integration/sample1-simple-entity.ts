import {expect} from "../deps/chai.ts";
import {runIfMain} from "../deps/mocha.ts";
import {Connection} from "../../src/connection/Connection.ts";
import {Post} from "../../sample/sample1-simple-entity/entity/Post.ts";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../utils/test-utils.ts";

describe.only("insertion", function() {

    // -------------------------------------------------------------------------
    // Setup
    // -------------------------------------------------------------------------
    let connections: Connection[];
    before(async () => connections = await createTestingConnections({
        entities: [Post],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    // -------------------------------------------------------------------------
    // Specifications: persist
    // -------------------------------------------------------------------------

    it("basic insert functionality", () => Promise.all(connections.map(async connection => {
        const postRepository = connection.getRepository(Post);

        let newPost = new Post();
        newPost.text = "Hello post";
        newPost.title = "this is post title";
        newPost.likesCount = 0;
        const savedPost = await postRepository.save(newPost);

        savedPost.should.be.equal(newPost);
        expect(savedPost.id).not.to.be.undefined;

        const insertedPost = await postRepository.findOne(savedPost.id);
        expect(insertedPost).not.to.be.undefined;
        insertedPost!.should.be.eql({
            id: savedPost.id,
            text: "Hello post",
            title: "this is post title",
            likesCount: 0
        });
    })));

});

runIfMain(import.meta);
