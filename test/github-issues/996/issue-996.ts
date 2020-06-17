import {runIfMain} from "../../deps/mocha.ts";
import {expect} from "../../deps/chai.ts";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils.ts";
import {Connection} from "../../../src/connection/Connection.ts";
import {Post} from "./entity/Post.ts";
import {Category} from "./entity/Category.ts";

describe("github issues > #996 already loaded via query builder relations should not be loaded again when they are lazily loaded", () => {

    let connections: Connection[];
    before(async () => connections = await createTestingConnections({
        entities: [Category, Post],
        enabledDrivers: ["mysql"] // only one driver is enabled because this example uses lazy relations
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("should be able to find by object reference", () => Promise.all(connections.map(async connection => {

        const category1 = new Category();
        category1.name = "Category #1";
        await connection.manager.save(category1);

        const category2 = new Category();
        category2.name = "Category #2";
        await connection.manager.save(category2);

        const post = new Post();
        post.title = "Post #1";
        post.categories = Promise.resolve([category1, category2]);
        await connection.manager.save(post);

        const loadedPost = await connection.manager
            .createQueryBuilder(Post, "post")
            .leftJoinAndSelect("post.categories", "categories")
            .getOne();

        expect(loadedPost).to.not.be.undefined;
        const categories = await loadedPost!.categories;
        categories.should.be.eql([{
            id: 1,
            name: "Category #1"
        }, {
            id: 2,
            name: "Category #2"
        }]);
    })));

});

runIfMain(import.meta);
