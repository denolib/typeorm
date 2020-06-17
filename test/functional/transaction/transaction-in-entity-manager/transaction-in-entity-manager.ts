import {runIfMain} from "../../../deps/mocha.ts";
import {expect} from "../../../deps/chai.ts";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../../utils/test-utils.ts";
import {Connection} from "../../../../src/connection/Connection.ts";
import {Post} from "./entity/Post.ts";
import {Category} from "./entity/Category.ts";

describe("transaction > transaction with entity manager", () => {

    let connections: Connection[];
    before(async () => connections = await createTestingConnections({
        entities: [Category, Post],
        enabledDrivers: ["mysql", "sqlite", "postgres"] // todo: for some reasons mariadb tests are not passing here
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("should execute all operations in a single transaction", () => Promise.all(connections.map(async connection => {

        let postId: number|undefined = undefined, categoryId: number|undefined = undefined;

        await connection.manager.transaction(async entityManager => {

            const post = new Post();
            post.title = "Post #1";
            await entityManager.save(post);

            const category = new Category();
            category.name = "Category #1";
            await entityManager.save(category);

            postId = post.id;
            categoryId = category.id;

        });

        const post = await connection.manager.findOne(Post, { where: { title: "Post #1" }});
        expect(post).not.to.be.undefined;
        post!.should.be.eql({
            id: postId,
            title: "Post #1"
        });

        const category = await connection.manager.findOne(Category, { where: { name: "Category #1" }});
        expect(category).not.to.be.undefined;
        category!.should.be.eql({
            id: categoryId,
            name: "Category #1"
        });

    })));

    it("should not save anything if any of operation in transaction fail", () => Promise.all(connections.map(async connection => {

        let postId: number|undefined = undefined, categoryId: number|undefined = undefined;

        try {
            await connection.manager.transaction(async entityManager => {

                const post = new Post();
                post.title = "Post #1";
                await entityManager.save(post);

                const category = new Category();
                category.name = "Category #1";
                await entityManager.save(category);

                postId = post.id;
                categoryId = category.id;

                const loadedPost = await entityManager.findOne(Post, { where: { title: "Post #1" }});
                expect(loadedPost).not.to.be.undefined;
                loadedPost!.should.be.eql({
                    id: postId,
                    title: "Post #1"
                });

                const loadedCategory = await entityManager.findOne(Category, { where: { name: "Category #1" }});
                expect(loadedCategory).not.to.be.undefined;
                loadedCategory!.should.be.eql({
                    id: categoryId,
                    name: "Category #1"
                });

                // now try to save post without title - it will fail and transaction will be reverted
                const wrongPost = new Post();
                await entityManager.save(wrongPost);

            });
        } catch (err) {
            /* skip error */
        }

        const post = await connection.manager.findOne(Post, { where: { title: "Post #1" }});
        expect(post).to.be.undefined;

        const category = await connection.manager.findOne(Category, { where: { name: "Category #1" }});
        expect(category).to.be.undefined;

    })));

});

runIfMain(import.meta);
