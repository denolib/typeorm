import {join as joinPaths} from "../../../vendor/https/deno.land/std/path/mod.ts";
import {runIfMain} from "../../deps/mocha.ts";
import {expect} from "../../deps/chai.ts";
import {getDirnameOfCurrentModule, closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils.ts";
import {Connection} from "../../../src/connection/Connection.ts";
import {Post} from "./entity/Post.ts";

describe("github issues > #1147 FindOptions should be able to accept custom where condition", () => {

    let connections: Connection[];
    const __dirname = getDirnameOfCurrentModule(import.meta);
    before(async () => connections = await createTestingConnections({
        entities: [joinPaths(__dirname, "/entity/*.ts")],
        schemaCreate: true,
        dropSchema: true,
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("should properly query using custom sql", () => Promise.all(connections.map(async connection => {

        const promises: Promise<any>[] = [];
        for (let i = 1; i <= 5; i++) {
            const post1 = new Post();
            post1.title = `post ${i}`;
            promises.push(connection.manager.save(post1));
        }
        await Promise.all(promises);

        const posts = await connection.manager.find(Post, { where: "Post.title LIKE '%3'" });
        posts.length.should.be.equal(1);
        expect(posts[0].title).to.be.equal("post 3");
    })));

});

runIfMain(import.meta);
