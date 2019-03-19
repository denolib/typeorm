import "reflect-metadata";
import {Connection} from "../../../../src";
import {CockroachDriver} from "../../../../src/driver/cockroachdb/CockroachDriver";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../../utils/test-utils";
import {PostIncrement} from "./entity/PostIncrement";
import {PostUuid} from "./entity/PostUuid";
import {PostDefaultValues} from "./entity/PostDefaultValues";
import {PostSpecialColumns} from "./entity/PostSpecialColumns";
import {PostMultiplePrimaryKeys} from "./entity/PostMultiplePrimaryKeys";
import {PostComplex} from "./entity/PostComplex";
import {PostEmbedded} from "./entity/PostEmbedded";

describe("persistence > entity updation", () => {

    let connections: Connection[];
    beforeAll(async () => connections = await createTestingConnections({ __dirname }));
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("should update generated auto-increment id after saving", () => Promise.all(connections.map(async connection => {
        const post = new PostIncrement();
        post.text = "Hello Post";
        await connection.manager.save(post);
        // CockroachDB does not use incremental ids
        if (!(connection.driver instanceof CockroachDriver))
            expect(post.id).toEqual(1);
    })));

    test("should update generated uuid after saving", () => Promise.all(connections.map(async connection => {
        const post = new PostUuid();
        post.text = "Hello Post";
        await connection.manager.save(post);
        const loadedPost = await connection.manager.findOne(PostUuid);
        expect(post.id).toEqual(loadedPost!.id);
    })));

    test("should update default values after saving", () => Promise.all(connections.map(async connection => {
        const post = new PostDefaultValues();
        post.title = "Post #1";
        await connection.manager.save(post);
        expect(post.title).toEqual("Post #1");
        expect(post.text).toEqual("hello post");
        expect(post.isActive).toEqual(true);
        expect(post.addDate).toBeInstanceOf(Date);
        expect(post.views).toEqual(0);
        expect(post.description).toEqual(null);
    })));

    test("should update special columns after saving", () => Promise.all(connections.map(async connection => {
        const post = new PostSpecialColumns();
        post.title = "Post #1";
        await connection.manager.save(post);
        expect(post.title).toEqual("Post #1");
        expect(post.createDate).toBeInstanceOf(Date);
        expect(post.updateDate).toBeInstanceOf(Date);
        expect(post.version).toEqual(1);
    })));

    test("should update even when multiple primary keys are used", () => Promise.all(connections.map(async connection => {
        const post = new PostMultiplePrimaryKeys();
        post.firstId = 1;
        post.secondId = 3;
        await connection.manager.save(post);
        expect(post.firstId).toEqual(1);
        expect(post.secondId).toEqual(3);
        expect(post.text).toEqual("Hello Multi Ids");
    })));

    test("should update even with embeddeds", () => Promise.all(connections.map(async connection => {
        const post = new PostComplex();
        post.firstId = 1;
        post.embed = new PostEmbedded();
        post.embed.secondId = 3;
        await connection.manager.save(post);
        expect(post!.firstId).toEqual(1);
        expect(post!.embed.secondId).toEqual(3);
        expect(post!.embed.createDate).toBeInstanceOf(Date);
        expect(post!.embed.updateDate).toBeInstanceOf(Date);
        expect(post!.embed.version).toEqual(1);
        expect(post!.text).toEqual("Hello Complexity");

        const loadedPost = await connection.manager.findOne(PostComplex, { firstId: 1, embed: { secondId: 3 }});
        expect(loadedPost!.firstId).toEqual(1);
        expect(loadedPost!.embed.secondId).toEqual(3);
        expect(loadedPost!.embed.createDate).toBeInstanceOf(Date);
        expect(loadedPost!.embed.updateDate).toBeInstanceOf(Date);
        expect(loadedPost!.embed.version).toEqual(1);
        expect(loadedPost!.text).toEqual("Hello Complexity");
    })));

});
