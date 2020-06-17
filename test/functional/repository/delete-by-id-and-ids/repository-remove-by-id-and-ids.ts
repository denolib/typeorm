import {runIfMain} from "../../../deps/mocha.ts";
import {expect} from "../../../deps/chai.ts";
import {Connection} from "../../../../src/connection/Connection.ts";
import {Post} from "./entity/Post.ts";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../../utils/test-utils.ts";

describe("repository > deleteById methods", function() {

    // -------------------------------------------------------------------------
    // Configuration
    // -------------------------------------------------------------------------

    let connections: Connection[];
    before(async () => connections = await createTestingConnections({
        entities: [Post],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    // -------------------------------------------------------------------------
    // Specifications
    // -------------------------------------------------------------------------

    it("remove using deleteById method should delete successfully", () => Promise.all(connections.map(async connection => {
        const postRepository = connection.getRepository(Post);

        // save a new posts
        const newPost1 = postRepository.create();
        newPost1.title = "Super post #1";
        const newPost2 = postRepository.create();
        newPost2.title = "Super post #2";
        const newPost3 = postRepository.create();
        newPost3.title = "Super post #3";
        const newPost4 = postRepository.create();
        newPost4.title = "Super post #4";

        await Promise.all([
            postRepository.save(newPost1),
            postRepository.save(newPost2),
            postRepository.save(newPost3),
            postRepository.save(newPost4)
        ]);

        // remove one
        await postRepository.delete(1);

        // load to check
        const loadedPosts = await postRepository.find();

        // assert
        loadedPosts.length.should.be.equal(3);
        expect(loadedPosts.find(p => p.id === 1)).to.be.undefined;
        expect(loadedPosts.find(p => p.id === 2)).not.to.be.undefined;
        expect(loadedPosts.find(p => p.id === 3)).not.to.be.undefined;
        expect(loadedPosts.find(p => p.id === 4)).not.to.be.undefined;
    })));

    it("remove using removeByIds method should delete successfully",  () => Promise.all(connections.map(async connection => {
        const postRepository = connection.getRepository(Post);

        // save a new posts
        const newPost1 = postRepository.create();
        newPost1.title = "Super post #1";
        const newPost2 = postRepository.create();
        newPost2.title = "Super post #2";
        const newPost3 = postRepository.create();
        newPost3.title = "Super post #3";
        const newPost4 = postRepository.create();
        newPost4.title = "Super post #4";

        await Promise.all([
            postRepository.save(newPost1),
            postRepository.save(newPost2),
            postRepository.save(newPost3),
            postRepository.save(newPost4)
        ]);

        // remove multiple
        await postRepository.delete([2, 3]);

        // load to check
        const loadedPosts = await postRepository.find();

        // assert
        loadedPosts.length.should.be.equal(2);
        expect(loadedPosts.find(p => p.id === 1)).not.to.be.undefined;
        expect(loadedPosts.find(p => p.id === 2)).to.be.undefined;
        expect(loadedPosts.find(p => p.id === 3)).to.be.undefined;
        expect(loadedPosts.find(p => p.id === 4)).not.to.be.undefined;
    })));

});

runIfMain(import.meta);
