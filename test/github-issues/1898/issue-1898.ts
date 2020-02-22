import {join as joinPaths} from "../../../vendor/https/deno.land/std/path/mod.ts";
import {runIfMain} from "../../deps/mocha.ts";
import "../../deps/chai.ts";
import {Connection} from "../../../src/connection/Connection.ts";
import {getDirnameOfCurrentModule, closeTestingConnections, createTestingConnections} from "../../utils/test-utils.ts";
import {Post} from "./entity/Post.ts";

describe("github issues > #1898 Simple JSON breaking in @next", () => {

    let connections: Connection[];
    const __dirname = getDirnameOfCurrentModule(import.meta);
    before(async () => {
        connections = await createTestingConnections({
            entities: [joinPaths(__dirname, "/entity/*.ts")],
            enabledDrivers: ["sqlite"],
            schemaCreate: true,
            dropSchema: true
        });
    });
    after(() => closeTestingConnections(connections));

    it("should correctly persist", () => Promise.all(connections.map(async connection => {
        const post = new Post();
        post.type = "post";
        await connection.getRepository(Post).save(post);
    })));

});

runIfMain(import.meta);
