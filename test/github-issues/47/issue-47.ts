import {runIfMain} from "../../deps/mocha.ts";
import {expect} from "../../deps/chai.ts";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils.ts";
import {Connection} from "../../../src/connection/Connection.ts";
import {Post} from "./entity/Post.ts";
import {Category} from "./entity/Category.ts";

describe("github issues > #47 wrong sql syntax when loading lazy relation", () => {

    let connections: Connection[];
    before(async () => connections = await createTestingConnections({
        entities: [Category, Post],
        enabledDrivers: ["mysql"] // we can properly test lazy-relations only on one platform
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("should persist successfully and return persisted entity", () => Promise.all(connections.map(async connection => {

        // create objects to save
        const category1 = new Category();
        category1.name = "category #1";

        const post1 = new Post();
        post1.title = "Hello Post #1";
        post1.category = Promise.resolve(category1);
        expect(await post1.category).to.equal(category1);

        const category2 = new Category();
        category2.name = "category #2";

        const post2 = new Post();
        post2.title = "Hello Post #2";
        post2.category = Promise.resolve(category2);

        // persist
        await connection.manager.save(category1);
        await connection.manager.save(post1);
        await connection.manager.save(category2);
        await connection.manager.save(post2);

        // check that all persisted objects exist
        const loadedPost = await connection.manager
            .createQueryBuilder(Post, "post")
            .getMany();

        const loadedCategory1 = await loadedPost[0].category;
        expect(loadedCategory1!).not.to.be.undefined;
        loadedCategory1!.id.should.equal(1);
        loadedCategory1!.name.should.equal("category #1");

        const loadedCategory2 = await loadedPost[1].category;
        expect(loadedCategory2!).not.to.be.undefined;
        loadedCategory2!.id.should.equal(2);
        loadedCategory2!.name.should.equal("category #2");

        const loadedPosts1 = await loadedCategory1.posts;
        expect(loadedPosts1!).not.to.be.undefined;
        loadedPosts1![0].id.should.equal(1);
        loadedPosts1![0].title.should.equal("Hello Post #1");

        const loadedPosts2 = await loadedCategory2.posts;
        expect(loadedPosts2!).not.to.be.undefined;
        loadedPosts2![0].id.should.equal(2);
        loadedPosts2![0].title.should.equal("Hello Post #2");

        const reloadedPost = await connection.manager.findOne(Post, {id: post1.id});

        const promise = reloadedPost!.category;
        reloadedPost!.category = Promise.resolve(category2);
        (await promise).id.should.equal(category1.id);
        (await reloadedPost!.category).id.should.equal(category2.id);
        // todo: need to test somehow how query is being generated, or how many raw data is returned

    })));

});

runIfMain(import.meta);
