import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../../utils/test-utils.ts";
import {Connection} from "../../../../src/connection/Connection.ts";
import {Post} from "./entity/Post.ts";
import {PostCounter} from "./entity/PostCounter.ts";
import {PostInformation} from "./entity/PostInformation.ts";
import {runIfMain} from "../../../deps/mocha.ts";
import {expect} from "../../../deps/chai.ts";

describe("other issues > entity listeners must work in embeddeds as well", () => {

    let connections: Connection[];
    before(async () => connections = await createTestingConnections({
        entities: [Post, PostCounter, PostInformation],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("getters and setters should work correctly", () => Promise.all(connections.map(async connection => {

        const post = new Post();
        post.title = "Super title";
        post.text = "About this post";
        await connection.manager.save(post);

        const loadedPost = await connection
            .manager
            .createQueryBuilder(Post, "post")
            .where("post.id = :id", { id: post.id })
            .getOne();

        expect(loadedPost).not.to.be.undefined;
        expect(loadedPost!.title).not.to.be.undefined;
        expect(loadedPost!.text).not.to.be.undefined;
        loadedPost!.title.should.be.equal("Super title");
        loadedPost!.text.should.be.equal("About this post");

    })));

});

runIfMain(import.meta);
