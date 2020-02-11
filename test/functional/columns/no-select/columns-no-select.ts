import {runIfMain} from "../../../deps/mocha.ts";
import {expect} from "../../../deps/chai.ts";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../../utils/test-utils.ts";
import {Connection} from "../../../../src/connection/Connection.ts";
import {Post} from "./entity/Post.ts";

describe("columns > no-selection functionality", () => {

    let connections: Connection[];
    before(async () => connections = await createTestingConnections({
        entities: [Post],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("should not select columns marked with select: false option", () => Promise.all(connections.map(async connection => {
        const postRepository = connection.getRepository(Post);

        // create and save a post first
        const post = new Post();
        post.title = "About columns";
        post.text = "Some text about columns";
        post.authorName = "Umed";
        await postRepository.save(post);

        // check if all columns are updated except for readonly columns
        const loadedPost = await postRepository.findOne(post.id);
        expect(loadedPost!.title).to.be.equal("About columns");
        expect(loadedPost!.text).to.be.equal("Some text about columns");
        expect(loadedPost!.authorName).to.be.undefined;
    })));

    it("should not select columns with QueryBuilder marked with select: false option", () => Promise.all(connections.map(async connection => {
        const postRepository = connection.getRepository(Post);

        // create and save a post first
        const post = new Post();
        post.title = "About columns";
        post.text = "Some text about columns";
        post.authorName = "Umed";
        await postRepository.save(post);

        // check if all columns are updated except for readonly columns
        const loadedPost = await postRepository
            .createQueryBuilder("post")
            .where("post.id = :id", { id: post.id })
            .getOne();
        expect(loadedPost!.title).to.be.equal("About columns");
        expect(loadedPost!.text).to.be.equal("Some text about columns");
        expect(loadedPost!.authorName).to.be.undefined;
    })));

    it("should select columns with select: false even columns were implicitly selected", () => Promise.all(connections.map(async connection => {
        const postRepository = connection.getRepository(Post);

        // create and save a post first
        const post = new Post();
        post.title = "About columns";
        post.text = "Some text about columns";
        post.authorName = "Umed";
        await postRepository.save(post);

        // check if all columns are updated except for readonly columns
        const loadedPost = await postRepository
            .createQueryBuilder("post")
            .addSelect("post.authorName")
            .where("post.id = :id", { id: post.id })
            .getOne();
        expect(loadedPost!.title).to.be.equal("About columns");
        expect(loadedPost!.text).to.be.equal("Some text about columns");
        expect(loadedPost!.authorName).to.be.equal("Umed");
    })));

});

runIfMain(import.meta);
