import {join as joinPaths} from "../../../vendor/https/deno.land/std/path/mod.ts";
import {runIfMain} from "../../deps/mocha.ts";
import {expect} from "../../deps/chai.ts";
import {getDirnameOfCurrentModule, createTestingConnections, closeTestingConnections, reloadTestingDatabases} from "../../utils/test-utils.ts";
import {Connection} from "../../../src/connection/Connection.ts";
import {Post} from "./entity/Post.ts";

describe("github issues > #1245 `findByIds` ignores `FindManyOptions`", () => {

    let connections: Connection[];
    const __dirname = getDirnameOfCurrentModule(import.meta);
    before(async () => connections = await createTestingConnections({
        entities: [joinPaths(__dirname, "/entity/*.ts")],
        schemaCreate: true,
        dropSchema: true,
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("should filter correctly using findByIds", () => Promise.all(connections.map(async connection => {

        let post1 = new Post();
        post1.name = "some_name";

        let post2 = new Post();
        post2.name = "some_name";

        let post3 = new Post();
        post3.name = "other_name";

        await connection.manager.save([post1, post2, post3]);

        expect(await connection.manager.findByIds(
          Post, [post2.id, post3.id], { name: "some_name" }
        )).to.eql([post2]);

    })));

    it("should filter correctly using findByIds", () => Promise.all(connections.map(async connection => {

        let post1 = new Post();
        post1.name = "some_name";

        let post2 = new Post();
        post2.name = "some_name";

        let post3 = new Post();
        post3.name = "other_name";

        await connection.manager.save([post1, post2, post3]);

        expect(await connection.manager.findByIds(
          Post, [post2.id, post3.id], { where: { name: "some_name" } }
        )).to.eql([post2]);

    })));

});

runIfMain(import.meta);
