import "reflect-metadata";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../../test/utils/test-utils";
import {Connection} from "../../../src";
import {Post} from "./entity/Post";

describe("other issues > escaping function parameter", () => {

    let connections: Connection[];
    beforeAll(async () => connections = await createTestingConnections({
        entities: [__dirname + "/entity/*{.js,.ts}"],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("select query builder should ignore function-based parameters", () => Promise.all(connections.map(async connection => {

        const post = new Post();
        post.title = "Super title";
        await connection.manager.save(post);

        expect(() => {
            return connection
                .manager
                .createQueryBuilder(Post, "post")
                .where("post.title = :title", { title: () => "Super title" })
                .getOne();
        }).toThrow(Error);
    })));

    test("insert query builder should work with function parameters", () => Promise.all(connections.map(async connection => {

        await connection
            .manager
            .getRepository(Post)
            .createQueryBuilder()
            .insert()
            .values({
                title: () => "'super title'"
            })
            .execute();

        const post = await connection.manager.findOne(Post, { title: "super title" });
        expect(post).toEqual({ id: 1, title: "super title" });

    })));

    test("update query builder should work with function parameters", () => Promise.all(connections.map(async connection => {

        const post = new Post();
        post.title = "Super title";
        await connection.manager.save(post);

        await connection
            .manager
            .getRepository(Post)
            .createQueryBuilder()
            .update()
            .set({
                title: () => "'super title'"
            })
            .execute();

        const loadedPost = await connection.manager.findOne(Post, { title: "super title" });
        expect(loadedPost).toEqual({ id: 1, title: "super title" });

    })));

});
