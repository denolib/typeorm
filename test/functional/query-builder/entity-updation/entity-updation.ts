import {runIfMain} from "../../../deps/mocha.ts";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../../utils/test-utils.ts";
import {Connection} from "../../../../src/connection/Connection.ts";
import {Post} from "./entity/Post.ts";
import {expect} from "../../../deps/chai.ts";

describe("query builder > entity updation", () => {

    let connections: Connection[];
    before(async () => connections = await createTestingConnections({
        entities: [Post],
        enabledDrivers: ["postgres", "mysql", "mssql", "oracle", "cockroachdb", "mongodb"] // TODO(uki00a) Remove `enabledDrivers` when deno-sqlite supports `datetime('now')`.
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("should update entity model after insertion if updateEntity is set to true", () => Promise.all(connections.map(async connection => {

        const post = new Post();
        post.title = "about entity updation in query builder";

        await connection.createQueryBuilder()
            .insert()
            .into(Post)
            .values(post)
            .updateEntity(true)
            .execute();

        post.title.should.be.equal("about entity updation in query builder");
        post.order.should.be.equal(100);
        post.createDate.should.be.instanceof(Date);
        post.updateDate.should.be.instanceof(Date);
    })));

    it("should not update entity model after insertion if updateEntity is set to false", () => Promise.all(connections.map(async connection => {

        const post = new Post();
        post.title = "about entity updation in query builder";

        await connection.createQueryBuilder()
            .insert()
            .into(Post)
            .values(post)
            .updateEntity(false)
            .execute();

        expect(post.id).to.be.undefined;
        post.title.should.be.equal("about entity updation in query builder");
        expect(post.order).to.be.undefined;
        expect(post.createDate).to.be.undefined;
        expect(post.updateDate).to.be.undefined;
    })));

    it("should not override already set properties", () => Promise.all(connections.map(async connection => {

        const post = new Post();
        post.title = "about entity updation in query builder";
        post.order = 101;

        await connection.createQueryBuilder()
            .insert()
            .into(Post)
            .values(post)
            .updateEntity(true)
            .execute();

        post.title.should.be.equal("about entity updation in query builder");
        post.order.should.be.equal(101);
        post.createDate.should.be.instanceof(Date);
        post.updateDate.should.be.instanceof(Date);
    })));

    it("should update entity model after save", () => Promise.all(connections.map(async connection => {

        const post = new Post();
        post.title = "about entity updation in query builder";
        await connection.manager.save(post);
        post.version.should.be.equal(1);

        await connection.manager.save(post);
        post.version.should.be.equal(1);

        post.title = "changed title";
        await connection.manager.save(post);
        post.version.should.be.equal(2);
    })));

    it("should update special entity properties after entity updation if updateEntity is set to true", () => Promise.all(connections.map(async connection => {

        const post = new Post();
        post.title = "about entity updation in query builder";
        await connection.manager.save(post);
        post.version.should.be.equal(1);

        await connection.createQueryBuilder()
            .update(Post)
            .set({ title: "again changed title" })
            .whereEntity(post)
            .updateEntity(true)
            .execute();

        post.version.should.be.equal(2);
    })));

    it("should not update special entity properties after entity updation if updateEntity is set to true", () => Promise.all(connections.map(async connection => {

        const post = new Post();
        post.title = "about entity updation in query builder";
        await connection.manager.save(post);
        post.version.should.be.equal(1);

        await connection.createQueryBuilder()
            .update(Post)
            .set({ title: "again changed title" })
            .whereEntity(post)
            .updateEntity(false)
            .execute();

        post.version.should.be.equal(1);
    })));

});

runIfMain(import.meta);
