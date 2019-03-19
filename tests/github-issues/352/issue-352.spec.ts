import "reflect-metadata";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../../test/utils/test-utils";
import {Connection} from "../../../src";
import {Post} from "./entity/Post";
import {MssqlParameter} from "../../../src";

describe("github issues > #352 double precision round to int in mssql", () => {

    let connections: Connection[];
    beforeAll(async () => connections = await createTestingConnections({
        entities: [__dirname + "/entity/*{.js,.ts}"],
        enabledDrivers: ["mssql"]
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("real number should be successfully stored and loaded from db including value in parameters", () => Promise.all(connections.map(async connection => {

        const posts: Post[] = [];
        for (let i = 1; i <= 25; i++) {
            const post = new Post();
            post.id = i + 0.234567789;
            post.title = "hello post";
            posts.push(post);
        }
        await connection.manager.save(posts);

        const loadedPost = await connection.manager
            .createQueryBuilder(Post, "post")
            .where("post.id = :id", { id: new MssqlParameter(1.234567789, "float") })
            .getOne();

        expect(loadedPost).toBeDefined();
        expect(loadedPost!.id).toEqual(1.234567789);

    })));

});
