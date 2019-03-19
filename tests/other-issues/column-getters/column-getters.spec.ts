import "reflect-metadata";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils";
import {Connection} from "../../../src";
import {Post} from "./entity/Post";

describe("other issues > column with getter / setter should work", () => {

    let connections: Connection[];
    beforeAll(async () => connections = await createTestingConnections({
        entities: [__dirname + "/entity/*{.js,.ts}"],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("getters and setters should work correctly", () => Promise.all(connections.map(async connection => {

        const post = new Post();
        post.title = "Super title";
        post.text = "About this post";
        await connection.manager.save(post);

        const loadedPost = await connection
            .manager
            .createQueryBuilder(Post, "post")
            .where("post.id = :id", { id: 1 })
            .getOne();

        expect(loadedPost).not.toBeUndefined();
        expect(loadedPost!.title).not.toBeUndefined();
        expect(loadedPost!.text).not.toBeUndefined();
        expect(loadedPost!.title).toEqual("Super title");
        expect(loadedPost!.text).toEqual("About this post");

    })));

});
