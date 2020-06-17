import {runIfMain} from "../../deps/mocha.ts";
import "../../deps/chai.ts";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils.ts";
import {Connection} from "../../../src/index.ts";
import {Post} from "./entity/Post.ts";
import {Category} from "./entity/Category.ts";

describe("github issues > #1720 Listener not invoked when relation loaded through getter", () => {

    let connections: Connection[];
    before(async () => connections = await createTestingConnections({
        entities: [Category, Post],
        enabledDrivers: ["mysql"]
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("should work as expected", () => Promise.all(connections.map(async connection => {
        const category1 = new Category();
        category1.name = "cat #1";
        await connection.manager.save(category1);

        const category2 = new Category();
        category2.name = "cat #2";
        await connection.manager.save(category2);

        const post1 = new Post();
        post1.title = "post #1";
        post1.categories = [category1, category2];
        await connection.manager.save(post1);

        const loadedPost = await connection.manager.findOne(Post, { relations: ["categories"] });
        loadedPost!.categories[0].loaded.should.be.equal(true);
        loadedPost!.categories[1].loaded.should.be.equal(true);
    })));

});

runIfMain(import.meta);
