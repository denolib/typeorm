import {runIfMain} from "../../deps/mocha.ts";
import {expect} from "../../deps/chai.ts";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils.ts";
import {Connection} from "../../../src/connection/Connection.ts";
import {Post} from "./entity/Post.ts";

describe("other issues > mongodb entity change in listeners should affect persistence", () => {

    let connections: Connection[];
    before(async () => connections = await createTestingConnections({
        enabledDrivers: ["mongodb"],
        entities: [Post],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("if entity was changed in the listener, changed property should be updated in the db", () => Promise.all(connections.map(async function (connection) {

        // insert a post
        const post = new Post();
        post.title = "hello";
        await connection.manager.save(post);

        // check if it was inserted correctly
        const loadedPost = await connection.manager.findOne(Post);
        expect(loadedPost).not.to.be.undefined;
        loadedPost!.title.should.be.equal("hello");

        // now update some property and let update listener trigger
        loadedPost!.active = true;
        await connection.manager.save(loadedPost!);

        // check if update listener was triggered and entity was really updated by the changes in the listener
        const loadedUpdatedPost = await connection.manager.findOne(Post);

        expect(loadedUpdatedPost).not.to.be.undefined;
        loadedUpdatedPost!.title.should.be.equal("hello!");
        await connection.manager.save(loadedPost!);

    })));

    it("if entity was loaded in the listener, loaded property should be changed", () => Promise.all(connections.map(async function (connection) {

        // insert a post
        const post = new Post();
        post.title = "hello";
        await connection.manager.save(post);

        const loadedPost = await connection.manager.findOne(Post);

        expect(loadedPost).not.to.be.undefined;
        loadedPost!.loaded.should.be.equal(true);
        await connection.manager.save(loadedPost!);

    })));
});

runIfMain(import.meta);
