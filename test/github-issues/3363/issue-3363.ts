import {join as joinPaths} from "../../../vendor/https/deno.land/std/path/mod.ts";
import {runIfMain} from "../../deps/mocha.ts";
import {expect} from "../../deps/chai.ts";
import {SapDriver} from "../../../src/driver/sap/SapDriver.ts";
import {getDirnameOfCurrentModule, closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils.ts";
import {Connection} from "../../../src/connection/Connection.ts";
import {Post} from "./entity/Post.ts";
import { Category } from "./entity/Category.ts";

describe("github issues > #3363 Isolation Level in transaction() from Connection", () => {

    let connections: Connection[];
    const __dirname = getDirnameOfCurrentModule(import.meta);
    before(async () => connections = await createTestingConnections({
        entities: [Category, Post],
        subscribers: [joinPaths(__dirname, "/subscriber/*.ts")]
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("should execute operations in READ UNCOMMITED isolation level", () => Promise.all(connections.map(async function(connection) {
        // SAP does not support READ UNCOMMITTED isolation level
        if (connection.driver instanceof SapDriver)
            return;

        let postId: number|undefined = undefined, categoryId: number|undefined = undefined;

        await connection.transaction("READ UNCOMMITTED", async transaction => {

            const post = new Post();
            post.title = "Post #1";
            await transaction.save(post);

            const category = new Category();
            category.name = "Category #1";
            await transaction.save(category);

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

    it("should execute operations in SERIALIZABLE isolation level", () => Promise.all(connections.map(async connection => {

        let postId: number|undefined = undefined, categoryId: number|undefined = undefined;

        await connection.transaction("SERIALIZABLE", async entityManager => {

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

});

runIfMain(import.meta);
