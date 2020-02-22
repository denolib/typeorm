import {join as joinPaths} from "../../../vendor/https/deno.land/std/path/mod.ts";
import {runIfMain} from "../../deps/mocha.ts";
import {expect} from "../../deps/chai.ts";
import {getDirnameOfCurrentModule, closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils.ts";
import {Connection} from "../../../src/connection/Connection.ts";
import {Post} from "./entity/Post.ts";

describe("github issue > #1397 Spaces at the end of values are removed when inserting", () => {

    let connections: Connection[] = [];
    const __dirname = getDirnameOfCurrentModule(import.meta);
    before(async () => connections = await createTestingConnections({
        entities: [joinPaths(__dirname, "/entity/*.ts")],
        enabledDrivers: ["mysql"]
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("should not trim empty spaces when saving", () => Promise.all(connections.map(async connection => {

        const post = new Post();
        post.title = " About My Post   ";
        await connection.manager.save(post);
        post.title.should.be.equal(" About My Post   ");

        const loadedPost = await connection.manager.findOne(Post, { id: 1 });
        expect(loadedPost).not.to.be.undefined;
        loadedPost!.title.should.be.equal(" About My Post   ");
    })));

});

runIfMain(import.meta);
