import {Connection} from "../../../../src/connection/Connection.ts";
// TODO(uki00a) uncomment when CockroachDriver is implemented.
// import {CockroachDriver} from "../../../../src/driver/cockroachdb/CockroachDriver.ts";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../../utils/test-utils.ts";
import {PostIncrement} from "./entity/PostIncrement.ts";
import {PostUuid} from "./entity/PostUuid.ts";
import {PostDefaultValues} from "./entity/PostDefaultValues.ts";
import {PostSpecialColumns} from "./entity/PostSpecialColumns.ts";
import {expect} from "../../../deps/chai.ts";
import {runIfMain} from "../../../deps/mocha.ts";
import {PostMultiplePrimaryKeys} from "./entity/PostMultiplePrimaryKeys.ts";
import {PostComplex} from "./entity/PostComplex.ts";
import {PostEmbedded} from "./entity/PostEmbedded.ts";

describe("persistence > entity updation", () => {

    let connections: Connection[];
    before(async () => connections = await createTestingConnections({
        entities: [
            PostComplex,
            PostDefaultValues,
            PostEmbedded,
            PostIncrement,
            PostMultiplePrimaryKeys,
            PostSpecialColumns,
            PostUuid
        ],
        enabledDrivers: ["postgres", "mysql", "mssql", "oracle"] // TODO(uki00a) Remove this when deno-sqlite supports `datetime('now')`
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("should update generated auto-increment id after saving", () => Promise.all(connections.map(async connection => {
        const post = new PostIncrement();
        post.text = "Hello Post";
        await connection.manager.save(post);
        // CockroachDB does not use incremental ids
        if (true/* !(connection.driver instanceof CockroachDriver) */) // TODO(uki00a) uncomment this when CockroachDriver is implemented.
            post.id.should.be.equal(1);
    })));

    it("should update generated uuid after saving", () => Promise.all(connections.map(async connection => {
        const post = new PostUuid();
        post.text = "Hello Post";
        await connection.manager.save(post);
        const loadedPost = await connection.manager.findOne(PostUuid);
        post.id.should.be.equal(loadedPost!.id);
    })));

    it("should update default values after saving", () => Promise.all(connections.map(async connection => {
        const post = new PostDefaultValues();
        post.title = "Post #1";
        await connection.manager.save(post);
        post.title.should.be.equal("Post #1");
        post.text.should.be.equal("hello post");
        post.isActive.should.be.equal(true);
        post.addDate.should.be.instanceof(Date);
        post.views.should.be.equal(0);
        expect(post.description).to.be.equal(null);
    })));

    it("should update special columns after saving", () => Promise.all(connections.map(async connection => {
        const post = new PostSpecialColumns();
        post.title = "Post #1";
        await connection.manager.save(post);
        post.title.should.be.equal("Post #1");
        post.createDate.should.be.instanceof(Date);
        post.updateDate.should.be.instanceof(Date);
        post.version.should.be.equal(1);
    })));

    it("should update even when multiple primary keys are used", () => Promise.all(connections.map(async connection => {
        const post = new PostMultiplePrimaryKeys();
        post.firstId = 1;
        post.secondId = 3;
        await connection.manager.save(post);
        post.firstId.should.be.equal(1);
        post.secondId.should.be.equal(3);
        post.text.should.be.equal("Hello Multi Ids");
    })));

    it("should update even with embeddeds", () => Promise.all(connections.map(async connection => {
        const post = new PostComplex();
        post.firstId = 1;
        post.embed = new PostEmbedded();
        post.embed.secondId = 3;
        await connection.manager.save(post);
        post!.firstId.should.be.equal(1);
        post!.embed.secondId.should.be.equal(3);
        post!.embed.createDate.should.be.instanceof(Date);
        post!.embed.updateDate.should.be.instanceof(Date);
        post!.embed.version.should.be.equal(1);
        post!.text.should.be.equal("Hello Complexity");

        const loadedPost = await connection.manager.findOne(PostComplex, { firstId: 1, embed: { secondId: 3 }});
        loadedPost!.firstId.should.be.equal(1);
        loadedPost!.embed.secondId.should.be.equal(3);
        loadedPost!.embed.createDate.should.be.instanceof(Date);
        loadedPost!.embed.updateDate.should.be.instanceof(Date);
        loadedPost!.embed.version.should.be.equal(1);
        loadedPost!.text.should.be.equal("Hello Complexity");
    })));

});

runIfMain(import.meta);
