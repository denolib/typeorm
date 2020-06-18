import {runIfMain} from "../../deps/mocha.ts";
import {expect} from "../../deps/chai.ts";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils.ts";
import {Connection} from "../../../src/connection/Connection.ts";
import {Post} from "./entity/Post.ts";
import { Category } from "./entity/Category.ts";

describe("github issues > #1576 Entities with null as `id` are merged [@next]", () => {

    let connections: Connection[];
    before(async () => connections = await createTestingConnections({
        entities: [Category, Post],
        enabledDrivers: ["postgres"]
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("should successfully create object", () => Promise.all(connections.map(async connection => {
        const newpost = new Post();
        let cat1 = new Category();
        cat1.name2 = "1";
        let cat2 = new Category();
        cat2.name = "2";
        newpost.categories = [cat1, cat2];

        const post = connection.manager.create(Post, newpost);

        expect(post.categories).to.have.length(2);
    })));

});

runIfMain(import.meta);
