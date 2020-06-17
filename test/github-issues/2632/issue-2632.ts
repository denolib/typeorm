import {runIfMain} from "../../deps/mocha.ts";
import {expect} from "../../deps/chai.ts";
import {createTestingConnections, closeTestingConnections, reloadTestingDatabases} from "../../utils/test-utils.ts";
import {Connection} from "../../../src/connection/Connection.ts";
import {Post} from "./entity/Post.ts";
import {Category} from "./entity/Category.ts";

describe("github issues > #2632 createQueryBuilder relation remove works only if using ID", () => {

    let connections: Connection[];
    before(async () => connections = await createTestingConnections({
        entities: [Category, Post],
        schemaCreate: true,
        dropSchema: true,
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("should add and remove relations of an entity if given a mix of ids and objects", () => Promise.all(connections.map(async connection => {

        const post1 = new Post();
        post1.title = "post #1";
        await connection.manager.save(post1);

        const post2 = new Post();
        post2.title = "post #2";
        await connection.manager.save(post2);

        const category1 = new Category();
        category1.title = "category #1";
        await connection.manager.save(category1);

        const category2 = new Category();
        category2.title = "category #2";
        await connection.manager.save(category2);

        await connection
          .createQueryBuilder()
          .relation(Post, "categories")
          .of(post1)
          .add(1);

        let loadedPost1 = await connection.manager.findOne(Post, 1, { relations: ["categories"] });
        expect(loadedPost1!.categories).to.deep.include({ id: 1, title: "category #1" });

        await connection
          .createQueryBuilder()
          .relation(Post, "categories")
          .of(post1)
          .remove(1);

        loadedPost1 = await connection.manager.findOne(Post, 1, { relations: ["categories"] });
        expect(loadedPost1!.categories).to.be.eql([]);

        await connection
          .createQueryBuilder()
          .relation(Post, "categories")
          .of(2)
          .add(category2);

        let loadedPost2 = await connection.manager.findOne(Post, 2, { relations: ["categories"] });
        expect(loadedPost2!.categories).to.deep.include({ id: 2, title: "category #2" });

        await connection
          .createQueryBuilder()
          .relation(Post, "categories")
          .of(2)
          .remove(category2);

        loadedPost1 = await connection.manager.findOne(Post, 2, { relations: ["categories"] });
        expect(loadedPost1!.categories).to.be.eql([]);

    })));

});

runIfMain(import.meta);
