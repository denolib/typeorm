import {Connection} from "../../../../src/connection/Connection.ts";
import {Post} from "./entity/Post.ts";
import {Category} from "./entity/Category.ts";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../../utils/test-utils.ts";
import {runIfMain} from "../../../deps/mocha.ts";
// import {expect} from "chai";

describe("persistence > remove-topological-order", function() {

    // -------------------------------------------------------------------------
    // Configuration
    // -------------------------------------------------------------------------

    let connections: Connection[];
    before(async () => connections = await createTestingConnections({ entities: [Category, Post] }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    // -------------------------------------------------------------------------
    // Specifications
    // -------------------------------------------------------------------------

    it("should remove depend properties in a proper order", () => Promise.all(connections.map(async connection => {

        // insert some data
        const category1 = new Category();
        category1.name = "cat#1";

        const category2 = new Category();
        category2.name = "cat#2";

        const post = new Post();
        post.title = "about post";
        post.categories = [category1, category2];

        // check insertion
        await connection.manager.save(post);

        // check deletion
        await connection.manager.remove([category2, post, category1]);

        // todo: finish test, e.g. check actual queries
    })));

});

runIfMain(import.meta);
