import {runIfMain} from "../../deps/mocha.ts";
import {expect} from "../../deps/chai.ts";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils.ts";
import {Connection} from "../../../src/connection/Connection.ts";
import {Post} from "./entity/Post.ts";
import {Category} from "./entity/Category.ts";
import {PostCategory} from "./entity/PostCategory.ts";

describe("github issues > #58 relations with multiple primary keys", () => {

    let connections: Connection[];
    before(async () => connections = await createTestingConnections({
        entities: [Category, Post, PostCategory],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("should persist successfully and return persisted entity", () => Promise.all(connections.map(async connection => {

        // create objects to save
        const category1 = new Category();
        category1.name = "category #1";

        const category2 = new Category();
        category2.name = "category #2";

        const post = new Post();
        post.title = "Hello Post #1";

        const postCategory1 = new PostCategory();
        postCategory1.addedByAdmin = true;
        postCategory1.addedByUser = false;
        postCategory1.category = category1;
        postCategory1.post = post;

        const postCategory2 = new PostCategory();
        postCategory2.addedByAdmin = false;
        postCategory2.addedByUser = true;
        postCategory2.category = category2;
        postCategory2.post = post;

        await connection.manager.save(postCategory1);
        await connection.manager.save(postCategory2);

        // check that all persisted objects exist
        const loadedPost = await connection.manager
            .createQueryBuilder(Post, "post")
            .innerJoinAndSelect("post.categories", "postCategory")
            .innerJoinAndSelect("postCategory.category", "category")
            .getOne();

        expect(loadedPost!).not.to.be.undefined;
        loadedPost!.should.be.eql({
            id: 1,
            title: "Hello Post #1",
            categories: [{
                addedByAdmin: true,
                addedByUser: false,
                category: {
                    id: 1,
                    name: "category #1"
                }
            }, {
                addedByAdmin: false,
                addedByUser: true,
                category: {
                    id: 2,
                    name: "category #2"
                }
            }]
        });

    })));

});

runIfMain(import.meta);
