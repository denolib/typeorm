import {join as joinPaths} from "../../../vendor/https/deno.land/std/path/mod.ts";
import {runIfMain} from "../../deps/mocha.ts";
import {expect} from "../../deps/chai.ts";
import {getDirnameOfCurrentModule, closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils.ts";
import {Connection} from "../../../src/connection/Connection.ts";
import {Post} from "./entity/Post.ts";

describe("github issues > #499 postgres DATE hydrated as DATETIME object", () => {

    let connections: Connection[];
    const __dirname = getDirnameOfCurrentModule(import.meta);
    before(async () => connections = await createTestingConnections({
        entities: [joinPaths(__dirname, "/entity/*.ts")],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("should return date in a string format", () => Promise.all(connections.map(async connection => {

        const post = new Post();
        post.title = "Hello Post #1";
        post.date = "2017-01-25";
        await connection.manager.save(post);

        const loadedPost = await connection.manager.findOne(Post, { where: { title: "Hello Post #1" } });
        expect(loadedPost!).not.to.be.undefined;
        loadedPost!.date.should.be.equal("2017-01-25");
    })));

});

runIfMain(import.meta);
