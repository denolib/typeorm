import {join as joinPaths} from "../../../vendor/https/deno.land/std/path/mod.ts";
import {runIfMain} from "../../deps/mocha.ts";
import "../../deps/chai.ts";
import {getDirnameOfCurrentModule, closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils.ts";
import {Connection} from "../../../src/connection/Connection.ts";
import {Post} from "./entity/Post.ts";

describe("github issues > #433 default value (json) is not getting set in postgreSQL", () => {

    let connections: Connection[];
    const __dirname = getDirnameOfCurrentModule(import.meta);
    before(async () => connections = await createTestingConnections({
        entities: [joinPaths(__dirname, "/entity/*.ts")],
        enabledDrivers: ["postgres"],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("should successfully set default value in to JSON type column", () => Promise.all(connections.map(async connection => {
        const post = new Post();
        post.id = 1;
        await connection.getRepository(Post).save(post);
        const loadedPost = (await connection.getRepository(Post).findOne(1))!;
        loadedPost.json.should.be.eql({ hello: "world" });
    })));

});

runIfMain(import.meta);
