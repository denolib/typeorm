import {runIfMain} from "../../deps/mocha.ts";
import {expect} from "../../deps/chai.ts";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils.ts";
import {Connection} from "../../../src/connection/Connection.ts";
import {Post} from "./entity/Post.ts";
import {PostSubscriber} from "./subscriber/PostSubscriber.ts";

describe("other issues > mongodb entity change in subscribers should affect persistence", () => {

    let connections: Connection[];
    before(async () => connections = await createTestingConnections({
        entities: [Post],
        subscribers: [PostSubscriber],
        enabledDrivers: ["mongodb"]
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("if entity was changed, subscriber should be take updated columns", () => Promise.all(connections.map(async function(connection) {

        const post = new Post();
        post.title = "hello world";
        await connection.manager.save(post);

        // check if it was inserted correctly
        const loadedPost = await connection.manager.findOne(Post);
        expect(loadedPost).not.to.be.undefined;
        loadedPost!.active.should.be.equal(false);

        // now update some property and let update subscriber trigger
        loadedPost!.active = true;
        loadedPost!.title += "!";
        await connection.manager.save(loadedPost!);

        // check if subscriber was triggered and entity was really taken changed columns in the subscriber
        const loadedUpdatedPost = await connection.manager.findOne(Post);
        expect(loadedUpdatedPost).not.to.be.undefined;
        expect(loadedUpdatedPost!.title).to.equals("hello world!");
        expect(loadedUpdatedPost!.updatedColumns).to.equals(3); // it actually should be 2, but ObjectId column always added

        await connection.manager.save(loadedPost!);

    })));

    it("if entity was loaded, loaded property should be changed", () => Promise.all(connections.map(async function(connection) {

        const post = new Post();
        post.title = "hello world";
        await connection.manager.save(post);

        // check if it was inserted correctly
        const loadedPost = await connection.manager.findOne(Post);

        expect(loadedPost).not.to.be.undefined;
        loadedPost!.loaded.should.be.equal(true);

        await connection.manager.save(loadedPost!);

    })));

});

runIfMain(import.meta);
