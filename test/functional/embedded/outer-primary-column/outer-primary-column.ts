import {Post} from "./entity/Post.ts";
import {Counters} from "./entity/Counters.ts";
import {Connection} from "../../../../src/connection/Connection.ts";
import {expect} from "../../../deps/chai.ts";
import {runIfMain} from "../../../deps/mocha.ts";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../../utils/test-utils.ts";

describe("embedded > outer-primary-column", () => {

    let connections: Connection[];
    before(async () => connections = await createTestingConnections({
        entities: [Counters, Post],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("should insert, load, update and remove entities with embeddeds when primary column defined only in embedded entity", () => Promise.all(connections.map(async connection => {

        const postRepository = connection.getRepository(Post);

        const post1 = new Post();
        post1.title = "About cars";
        post1.text = "About cars";
        post1.counters = new Counters();
        post1.counters.code = 1;
        post1.counters.comments = 1;
        post1.counters.favorites = 2;
        post1.counters.likes = 3;
        await connection.getRepository(Post).save(post1);

        const post2 = new Post();
        post2.title = "About airplanes";
        post2.text = "About airplanes";
        post2.counters = new Counters();
        post2.counters.code = 2;
        post2.counters.comments = 2;
        post2.counters.favorites = 3;
        post2.counters.likes = 4;
        await postRepository.save(post2);

        const loadedPosts = await connection.manager
            .createQueryBuilder(Post, "post")
            .orderBy("post.counters.code")
            .getMany();

        expect(loadedPosts[0].title).to.be.equal("About cars");
        expect(loadedPosts[0].counters.should.be.eql({ code: 1, comments: 1, favorites: 2, likes: 3 }));
        expect(loadedPosts[1].title).to.be.equal("About airplanes");
        expect(loadedPosts[1].counters.should.be.eql({ code: 2, comments: 2, favorites: 3, likes: 4 }));

        const loadedPost = (await postRepository.findOne(1))!;
        expect(loadedPost.title).to.be.equal("About cars");
        expect(loadedPost.counters.should.be.eql({ code: 1, comments: 1, favorites: 2, likes: 3 }));

        loadedPost.counters.favorites += 1;
        await postRepository.save(loadedPost);

        const loadedPost2 = (await postRepository.findOne(1))!;
        expect(loadedPost.title).to.be.equal("About cars");
        expect(loadedPost.counters.should.be.eql({ code: 1, comments: 1, favorites: 3, likes: 3 }));

        await postRepository.remove(loadedPost2);

        const loadedPosts2 = (await postRepository.find())!;
        expect(loadedPosts2.length).to.be.equal(1);
        expect(loadedPosts2[0].title).to.be.equal("About airplanes");
    })));

});

runIfMain(import.meta);
