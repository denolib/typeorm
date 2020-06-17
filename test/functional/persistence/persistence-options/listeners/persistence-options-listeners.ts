import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../../../utils/test-utils.ts";
import {Post} from "./entity/Post.ts";
import {Connection} from "../../../../../src/connection/Connection.ts";
import "../../../../deps/chai.ts";
import {runIfMain} from "../../../../deps/mocha.ts";
// import {expect} from "chai";

describe("persistence > persistence options > listeners", () => {

    // -------------------------------------------------------------------------
    // Configuration
    // -------------------------------------------------------------------------

    let connections: Connection[];
    before(async () => connections = await createTestingConnections({ entities: [Post] }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    // -------------------------------------------------------------------------
    // Specifications
    // -------------------------------------------------------------------------

    it("save listeners should work by default", () => Promise.all(connections.map(async connection => {
        const post = new Post();
        post.title = "Bakhrom";
        post.description = "Hello";
        await connection.manager.save(post);
        post.title.should.be.equal("Bakhrom!");
    })));

    it("save listeners should be disabled if save option is specified", () => Promise.all(connections.map(async connection => {
        const post = new Post();
        post.title = "Bakhrom";
        post.description = "Hello";
        await connection.manager.save(post, { listeners: false });
        post.title.should.be.equal("Bakhrom");
    })));

    it("remove listeners should work by default", () => Promise.all(connections.map(async connection => {
        const post = new Post();
        post.title = "Bakhrom";
        post.description = "Hello";
        await connection.manager.save(post);
        await connection.manager.remove(post);
        post.isRemoved.should.be.equal(true);
    })));

    it("remove listeners should be disabled if remove option is specified", () => Promise.all(connections.map(async connection => {
        const post = new Post();
        post.title = "Bakhrom";
        post.description = "Hello";
        await connection.manager.save(post);
        await connection.manager.remove(post, { listeners: false });
        post.isRemoved.should.be.equal(false);
    })));

});

runIfMain(import.meta);
