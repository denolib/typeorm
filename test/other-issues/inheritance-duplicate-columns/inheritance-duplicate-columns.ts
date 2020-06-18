import {join as joinPaths} from "../../../vendor/https/deno.land/std/path/mod.ts";
import {runIfMain} from "../../deps/mocha.ts";
import {expect} from "../../deps/chai.ts";
import {getDirnameOfCurrentModule, closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils.ts";
import {Connection} from "../../../src/connection/Connection.ts";
import {Post} from "./entity/Post.ts";
import {BaseContent} from "./entity/BaseContent.ts";
import {BasePost} from "./entity/BasePost.ts";

describe("other issues > double inheritance produces multiple duplicated columns", () => {

    let connections: Connection[];
    const __dirname = getDirnameOfCurrentModule(import.meta);
    before(async () => connections = await createTestingConnections({
        entities: [Post, BaseContent, BasePost],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("should not produce duplicate columns", () => Promise.all(connections.map(async function(connection) {

        // insert a post
        const post = new Post();
        post.title = "hello";
        await connection.manager.save(post);

        // check if it was inserted correctly
        const loadedPost = await connection.manager.findOne(Post);
        expect(loadedPost).not.to.be.undefined;
        loadedPost!.title.should.be.equal("hello");

    })));

});

runIfMain(import.meta);
