import {runIfMain} from "../../deps/mocha.ts";
import {expect} from "../../deps/chai.ts";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils.ts";
import {Connection} from "../../../src/connection/Connection.ts";
import {Post} from "./entity/Post.ts";
import {Category} from "./entity/Category.ts";

describe("github issues > Join query on ManyToMany relations not working", () => {

    let connections: Connection[];
    before(async () => connections = await createTestingConnections({
        entities: [Category, Post],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("embedded with custom column name should persist and load without errors", () => Promise.all(connections.map(async connection => {

        for (let i = 0; i < 20; i++) {
            const category = new Category();
            category.name = "Category #" + i;
            await connection.manager.save(category);
        }

        const post = new Post();
        post.title = "SuperRace";
        post.categories = [new Category()];
        post.categories[0].name = "SuperCategory";
        await connection.manager.save(post);

        const loadedPost = await connection
            .manager
            .createQueryBuilder(Post, "post")
            .leftJoinAndSelect("post.categories", "category")
            .where("category.category_id IN (:...ids)", { ids: [21] })
            .getOne();

        expect(loadedPost).not.to.be.undefined;
        expect(loadedPost!.categories).not.to.be.undefined;

    })));

});

runIfMain(import.meta);
