import "reflect-metadata";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../../../test/utils/test-utils";
import {Connection} from "../../../../src";
import {Post} from "./entity/Post";

describe("query builder > select", () => {

    let connections: Connection[];
    beforeAll(async () => connections = await createTestingConnections({
        entities: [__dirname + "/entity/*{.js,.ts}"],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("should append all entity mapped columns from main selection to select statement", () => Promise.all(connections.map(async connection => {
        const sql = connection.manager.createQueryBuilder(Post, "post")
            .disableEscaping()
            .getSql();

        expect(sql).toEqual("SELECT post.id AS post_id, " +
            "post.title AS post_title, " +
            "post.description AS post_description, " +
            "post.rating AS post_rating, " +
            "post.version AS post_version, " +
            "post.categoryId AS post_categoryId " +
            "FROM post post");
    })));

    test("should append all entity mapped columns from both main selection and join selections to select statement", () => Promise.all(connections.map(async connection => {
        const sql = connection.createQueryBuilder(Post, "post")
            .leftJoinAndSelect("category", "category")
            .disableEscaping()
            .getSql();

        expect(sql).toEqual("SELECT post.id AS post_id, " +
            "post.title AS post_title, " +
            "post.description AS post_description, " +
            "post.rating AS post_rating, " +
            "post.version AS post_version, " +
            "post.categoryId AS post_categoryId, " +
            "category.id AS category_id, " +
            "category.name AS category_name," +
            " category.description AS category_description, " +
            "category.version AS category_version " +
            "FROM post post LEFT JOIN category category");
    })));

    test("should append entity mapped columns from both main alias and join aliases to select statement", () => Promise.all(connections.map(async connection => {
        const sql = connection.createQueryBuilder(Post, "post")
            .select("post.id")
            .addSelect("category.name")
            .leftJoin("category", "category")
            .disableEscaping()
            .getSql();

        expect(sql).toEqual("SELECT post.id AS post_id, " +
            "category.name AS category_name " +
            "FROM post post LEFT JOIN category category");
    })));

    test("should append entity mapped columns to select statement, if they passed as array", () => Promise.all(connections.map(async connection => {
        const sql = connection.createQueryBuilder(Post, "post")
            .select(["post.id", "post.title"])
            .disableEscaping()
            .getSql();

        expect(sql).toEqual("SELECT post.id AS post_id, post.title AS post_title FROM post post");
    })));

    test("should append raw sql to select statement", () => Promise.all(connections.map(async connection => {
        const sql = connection.createQueryBuilder(Post, "post")
            .select("COUNT(*) as cnt")
            .disableEscaping()
            .getSql();

        expect(sql).toEqual("SELECT COUNT(*) as cnt FROM post post");
    })));

    test("should append raw sql and entity mapped column to select statement", () => Promise.all(connections.map(async connection => {
        const sql = connection.createQueryBuilder(Post, "post")
            .select(["COUNT(*) as cnt", "post.title"])
            .disableEscaping()
            .getSql();

        expect(sql).toEqual("SELECT post.title AS post_title, COUNT(*) as cnt FROM post post");
    })));

    test("should not create alias for selection, which is not entity mapped column", () => Promise.all(connections.map(async connection => {
        const sql = connection.createQueryBuilder(Post, "post")
            .select("post.name")
            .disableEscaping()
            .getSql();

        expect(sql).toEqual("SELECT post.name FROM post post");
    })));

});
