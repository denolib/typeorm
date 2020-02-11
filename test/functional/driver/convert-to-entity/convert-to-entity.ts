import {runIfMain} from "../../../deps/mocha.ts";
import {expect} from "../../../deps/chai.ts";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../../utils/test-utils.ts";
import {Connection} from "../../../../src/connection/Connection.ts";
import {Post} from "./entity/Post.ts";

describe("driver > convert raw results to entity", () => {

    let connections: Connection[];
    before(async () => connections = await createTestingConnections({
        entities: [Post],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("should return null value in entity property when record column is null", () => Promise.all(connections.map(async connection => {
        const postRepository = connection.getRepository(Post);
        const post = new Post();
        post.id = 1;

        await postRepository.save(post);

        const loadedPost = await postRepository.findOne(1);
        if (loadedPost) {
            expect(loadedPost.isNew).to.be.equal(null);
        }
    })));

    it("should return true in entity property when record column is true", () => Promise.all(connections.map(async connection => {
        const postRepository = connection.getRepository(Post);
        const post = new Post();
        post.id = 1;
        post.isNew = true;

        await postRepository.save(post);

        const loadedPost = await postRepository.findOne(1);
        if (loadedPost) {
            expect(loadedPost.isNew).to.be.equal(true);
        }
    })));

    it("should return false in entity property when record column is false", () => Promise.all(connections.map(async connection => {
        const postRepository = connection.getRepository(Post);
        const post = new Post();
        post.id = 1;
        post.isNew = false;

        await postRepository.save(post);

        const loadedPost = await postRepository.findOne(1);
        if (loadedPost) {
            expect(loadedPost.isNew).to.be.equal(false);
        }
    })));
});

runIfMain(import.meta);
