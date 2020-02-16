import {join as joinPaths} from "../../../../vendor/https/deno.land/std/path/mod.ts";
import {runIfMain} from "../../../deps/mocha.ts";
import {expect} from "../../../deps/chai.ts";
import {getDirnameOfCurrentModule, closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../../utils/test-utils.ts";
import {Connection} from "../../../../src/connection/Connection.ts";
import {Post} from "./entity/Post.ts";

describe("query builder > insertion > on conflict", () => {

    let connections: Connection[];
    const __dirname = getDirnameOfCurrentModule(import.meta);
    before(async () => connections = await createTestingConnections({
        entities: [joinPaths(__dirname, "/entity/*.ts")],
        enabledDrivers: ["postgres", "sqlite"] // since on conflict statement is only supported in postgres and sqlite >= 3.24.0
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("should perform insertion correctly", () => Promise.all(connections.map(async connection => {

        const post1 = new Post();
        post1.id = "post#1";
        post1.title = "About post";

        await connection.createQueryBuilder()
            .insert()
            .into(Post)
            .values(post1)
            .execute();

        const post2 = new Post();
        post2.id = "post#1";
        post2.title = "Again post";

        await connection.createQueryBuilder()
            .insert()
            .into(Post)
            .values(post2)
            .onConflict(`("id") DO NOTHING`)
            .execute();

        expect(await connection.manager.findOne(Post, "post#1")).to.eql({
            id: "post#1",
            title: "About post"
        });

        await connection.createQueryBuilder()
            .insert()
            .into(Post)
            .values(post2)
            .onConflict(`("id") DO UPDATE SET "title" = :title`)
            .setParameter("title", post2.title)
            .execute();

        expect(await connection.manager.findOne(Post, "post#1")).to.eql({
            id: "post#1",
            title: "Again post"
        });
    })));

});

runIfMain(import.meta);
