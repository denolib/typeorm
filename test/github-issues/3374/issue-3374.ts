import {join as joinPaths} from "../../../vendor/https/deno.land/std/path/mod.ts";
import {runIfMain} from "../../deps/mocha.ts";
import {expect} from "../../deps/chai.ts";
import {getDirnameOfCurrentModule, closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils.ts";
import {Connection} from "../../../src/connection/Connection.ts";
import {Post} from "./entity/Post.ts";

describe("github issues > #3374 Synchronize issue with UUID (MySQL)", () => {

    let connections: Connection[];
    const __dirname = getDirnameOfCurrentModule(import.meta);
    before(async () => connections = await createTestingConnections({
        entities: [Post],
        subscribers: [joinPaths(__dirname, "/subscriber/*.ts")],
        enabledDrivers: ["mysql"]
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("should not drop primary column again", () => Promise.all(connections.map(async function(connection) {

        const post = new Post();
        post.id = 1;
        post.name = "hello world";
        await connection.manager.save(post);

        await connection.synchronize();

        const loadedPost = await connection.manager.find(Post, { name: "hello world" });
        expect(loadedPost).to.be.not.empty;

    })));

});

runIfMain(import.meta);
