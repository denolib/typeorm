import {runIfMain} from "../../deps/mocha.ts";
import {expect} from "../../deps/chai.ts";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils.ts";
import {Connection} from "../../../src/index.ts";
import {Post} from "./entity/Post.ts";

describe("other issues > preventing-injection", () => {

    let connections: Connection[];
    before(async () => connections = await createTestingConnections({
        entities: [Post],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("should not allow selection of non-exist columns via FindOptions", () => Promise.all(connections.map(async function(connection) {
        const post = new Post();
        post.title = "hello";
        await connection.manager.save(post);

        const postWithOnlyIdSelected = await connection.manager.find(Post, {
            select: ["id"]
        });
        postWithOnlyIdSelected.should.be.eql([{ id: 1 }]);

        let error;
        try {
            await connection.manager.find(Post, {
                select: ["(WHERE LIMIT 1)" as any]
            });
        } catch (err) {
            error = err;
        }
        expect(error).to.be.instanceOf(Error);
    })));

    it("should skip non-exist columns in where expression via FindOptions", () => Promise.all(connections.map(async function(connection) {
        const post = new Post();
        post.title = "hello";
        await connection.manager.save(post);

        const postWithOnlyIdSelected = await connection.manager.find(Post, {
            where: {
                title: "hello"
            }
        });
        postWithOnlyIdSelected.should.be.eql([{ id: 1, title: "hello" }]);

        const loadedPosts = await connection.manager.find(Post, {
            where: {
                id: 2,
                ["(WHERE LIMIT 1)"]: "hello"
            }
        });
        loadedPosts.should.be.eql([]);
    })));

    it("should not allow selection of non-exist columns via FindOptions", () => Promise.all(connections.map(async function(connection) {
        const post = new Post();
        post.title = "hello";
        await connection.manager.save(post);

        const loadedPosts = await connection.manager.find(Post, {
            order: {
                title: "DESC"
            }
        });
        loadedPosts.should.be.eql([{ id: 1, title: "hello" }]);

        let error;
        try {
            await connection.manager.find(Post, {
                order: {
                    ["(WHERE LIMIT 1)" as any]: "DESC"
                }
            });
        } catch (err) {
            error = err;
        }
        expect(error).to.be.instanceOf(Error);
    })));

    it("should not allow non-numeric values in skip and take via FindOptions", () => Promise.all(connections.map(async function(connection) {

        let error;

        try {
            await connection.manager.find(Post, {
                take: "(WHERE XXX)" as any
            });
        } catch (err) {
            error = err;
        }
        expect(error).to.be.instanceOf(Error);

        error = null;
        try {
            await connection.manager.find(Post, {
                skip: "(WHERE LIMIT 1)" as any,
                take: "(WHERE XXX)" as any,
            });
        } catch (err) {
            error = err;
        }
        expect(error).to.be.instanceOf(Error);
    })));

    it("should not allow non-numeric values in skip and take in QueryBuilder", () => Promise.all(connections.map(async function(connection) {

        expect(() => {
            connection.manager
                .createQueryBuilder(Post, "post")
                .take("(WHERE XXX)" as any);
        }).to.throw(Error);

        expect(() => {
            connection.manager
                .createQueryBuilder(Post, "post")
                .skip("(WHERE LIMIT 1)" as any);
        }).to.throw(Error);

    })));

    it("should not allow non-allowed values in order by in QueryBuilder", () => Promise.all(connections.map(async function(connection) {

        expect(() => {
            connection.manager
                .createQueryBuilder(Post, "post")
                .orderBy("post.id", "MIX" as any);
        }).to.throw(Error);

        expect(() => {
            connection.manager
                .createQueryBuilder(Post, "post")
                .orderBy("post.id", "DESC", "SOMETHING LAST" as any);
        }).to.throw(Error);

    })));

});

runIfMain(import.meta);
