import "reflect-metadata";
import { closeTestingConnections, createTestingConnections, reloadTestingDatabases } from "../../../../test/utils/test-utils";
import { Connection } from "../../../../src";
import { Post } from "./entity/Post";
import {PostInformation} from "./entity/PostInformation";
import {PostCounter} from "./entity/PostCounter";

describe("other issues > entity listeners must work in optional embeddeds as well", () => {

    let connections: Connection[];
    beforeAll(async () => connections = await createTestingConnections({
        entities: [__dirname + "/entity/*{.js,.ts}"],
        enabledDrivers: ["postgres"]
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("getters and setters should work correctly", () => Promise.all(connections.map(async connection => {

        const post1 = new Post();
        post1.title = "First title";
        post1.text = "About this post";
        await connection.manager.save(post1);

        const post2 = new Post();
        post2.title = "Second title";
        post2.text = "About this post";
        post2.information = new PostInformation();
        await connection.manager.save(post2);

        const post3 = new Post();
        post3.title = "Third title";
        post3.text = "About this post";
        post3.information = new PostInformation();
        post3.information.counters = new PostCounter();
        await connection.manager.save(post3);

        const loadedPosts = await connection
            .manager
            .createQueryBuilder(Post, "post")
            .orderBy("post.id")
            .getMany();

        expect(loadedPosts[0]).not.toBeUndefined();
        expect(loadedPosts[0]!.title).not.toBeUndefined();
        expect(loadedPosts[0]!.text).not.toBeUndefined();
        expect(loadedPosts[0]!.title).toEqual("First title");
        expect(loadedPosts[0]!.text).toEqual("About this post");

        expect(loadedPosts[1]).not.toBeUndefined();
        expect(loadedPosts[1]!.title).toEqual("Second title");
        expect(loadedPosts[1]!.information!.description)!.toEqual("default post description");

        expect(loadedPosts[2]).not.toBeUndefined();
        expect(loadedPosts[2]!.title).toEqual("Third title");
        expect(loadedPosts[2]!.information!.counters!.likes)!.toEqual(0);

    })));

});
