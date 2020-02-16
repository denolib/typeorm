import {join as joinPaths} from "../../../../vendor/https/deno.land/std/path/mod.ts";
import {runIfMain} from "../../../deps/mocha.ts";
import {expect} from "../../../deps/chai.ts";
import {Connection} from "../../../../src/connection/Connection.ts";
import {getDirnameOfCurrentModule, closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../../utils/test-utils.ts";
import {Post} from "./entity/Post.ts";

describe("table inheritance > regular inheritance using extends keyword", () => {

    let connections: Connection[];
    const __dirname = getDirnameOfCurrentModule(import.meta);
    before(async () => connections = await createTestingConnections({
        entities: [joinPaths(__dirname, "/entity/*.ts")],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("should work correctly", () => Promise.all(connections.map(async connection => {

        const post = new Post();
        post.name = "Super title";
        post.text = "About this post";
        await connection.manager.save(post);

        const loadedPost = await connection
            .manager
            .createQueryBuilder(Post, "post")
            .where("post.id = :id", { id: 1 })
            .getOne();

        expect(loadedPost).not.to.be.undefined;
        expect(loadedPost!.name).not.to.be.undefined;
        expect(loadedPost!.text).not.to.be.undefined;
        loadedPost!.name.should.be.equal("Super title");
        loadedPost!.text.should.be.equal("About this post");

    })));

});

runIfMain(import.meta);
