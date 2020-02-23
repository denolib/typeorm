import {join as joinPaths} from "../../../vendor/https/deno.land/std/path/mod.ts";
import {runIfMain} from "../../deps/mocha.ts";
import {expect} from "../../deps/chai.ts";
import {getDirnameOfCurrentModule, closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils.ts";
import {Connection} from "../../../src/connection/Connection.ts";
import {Post} from "./entity/Post.ts";

describe("other issues > escaping function parameter", () => {

    let connections: Connection[];
    const __dirname = getDirnameOfCurrentModule(import.meta);
    before(async () => connections = await createTestingConnections({
        entities: [joinPaths(__dirname, "/entity/*.ts")],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("select query builder should ignore function-based parameters", () => Promise.all(connections.map(async connection => {

        const post = new Post();
        post.title = "Super title";
        await connection.manager.save(post);

        expect(() => {
            return connection
                .manager
                .createQueryBuilder(Post, "post")
                .where("post.title = :title", { title: () => "Super title" })
                .getOne();
        }).to.throw(Error);
    })));

    it("insert query builder should work with function parameters", () => Promise.all(connections.map(async connection => {

        await connection
            .manager
            .getRepository(Post)
            .createQueryBuilder()
            .insert()
            .values({
                title: () => "'super title'"
            })
            .execute();

        const post = await connection.manager.findOne(Post, { title: "super title" });
        expect(post).to.be.eql({ id: 1, title: "super title" });

    })));

    it("update query builder should work with function parameters", () => Promise.all(connections.map(async connection => {

        const post = new Post();
        post.title = "Super title";
        await connection.manager.save(post);

        await connection
            .manager
            .getRepository(Post)
            .createQueryBuilder()
            .update()
            .set({
                title: () => "'super title'"
            })
            .execute();

        const loadedPost = await connection.manager.findOne(Post, { title: "super title" });
        expect(loadedPost).to.be.eql({ id: 1, title: "super title" });

    })));

});

runIfMain(import.meta);
