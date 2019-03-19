import "reflect-metadata";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils";
import {Connection} from "../../../src";
import {Post} from "./entity/Post";

describe("github issues > #499 postgres DATE hydrated as DATETIME object", () => {

    let connections: Connection[];
    beforeAll(async () => connections = await createTestingConnections({
        entities: [__dirname + "/entity/*{.js,.ts}"],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("should return date in a string format", () => Promise.all(connections.map(async connection => {

        const post = new Post();
        post.title = "Hello Post #1";
        post.date = "2017-01-25";
        await connection.manager.save(post);

        const loadedPost = await connection.manager.findOne(Post, { where: { title: "Hello Post #1" } });
        expect(loadedPost!).not.toBeUndefined();
        expect(loadedPost!.date).toEqual("2017-01-25");
    })));

});
