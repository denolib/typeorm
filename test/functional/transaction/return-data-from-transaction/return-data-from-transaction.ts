import {runIfMain} from "../../../deps/mocha.ts";
import {expect} from "../../../deps/chai.ts";
import {createTestingConnections, closeTestingConnections, reloadTestingDatabases} from "../../../utils/test-utils.ts";
import {Connection} from "../../../../src/connection/Connection.ts";
import {Post} from "./entity/Post.ts";
import {Category} from "./entity/Category.ts";

describe("transaction > return data from transaction", () => {

    let connections: Connection[];
    before(async () => connections = await createTestingConnections({
        entities: [Category, Post],
        enabledDrivers: ["mysql", "sqlite", "postgres"] // todo: for some reasons mariadb tests are not passing here
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("should allow to return typed data from transaction", () => Promise.all(connections.map(async connection => {

        const { postId, categoryId } = await connection.manager.transaction<{ postId: number, categoryId: number }>(async entityManager => {

            const post = new Post();
            post.title = "Post #1";
            await entityManager.save(post);

            const category = new Category();
            category.name = "Category #1";
            await entityManager.save(category);

            return {
                postId: post.id,
                categoryId: category.id
            };

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

    it("should allow to return typed data from transaction using type inference", () => Promise.all(connections.map(async connection => {

        const { postId, categoryId } = await connection.manager.transaction(async entityManager => {

            const post = new Post();
            post.title = "Post #1";
            await entityManager.save(post);

            const category = new Category();
            category.name = "Category #1";
            await entityManager.save(category);

            return {
                postId: post.id,
                categoryId: category.id
            };

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

});

runIfMain(import.meta);
