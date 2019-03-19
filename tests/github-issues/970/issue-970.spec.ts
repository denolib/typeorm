import "reflect-metadata";
import {Post} from "./entity/Post";
import {Connection} from "../../../src";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils";

describe("github issues > #970 Mongo Bad Sort Specification", () => {

    let connections: Connection[];
    beforeAll(async () => connections = await createTestingConnections({
        entities: [Post],
        enabledDrivers: ["mongodb"]
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("should order properly without errors", () => Promise.all(connections.map(async connection => {
        const postRepository = connection.getMongoRepository(Post);

        // save few posts
        const firstPost = new Post();
        firstPost.title = "Post";
        firstPost.text = "Everything about post #1";
        await postRepository.save(firstPost);

        const secondPost = new Post();
        secondPost.title = "Post";
        secondPost.text = "Everything about post #2";
        await postRepository.save(secondPost);

        const loadedPosts1 = await postRepository.find({ where: { title: "Post" }, order: { text: 1 } });
        expect(loadedPosts1[0])!.toBeInstanceOf(Post);
        expect(loadedPosts1[0]!.id).toEqual(firstPost.id);
        expect(loadedPosts1[0]!.title).toEqual("Post");
        expect(loadedPosts1[0]!.text).toEqual("Everything about post #1");

        const loadedPosts2 = await postRepository.find({ where: { title: "Post" }, order: { text: "ASC" } });
        expect(loadedPosts2[0])!.toBeInstanceOf(Post);
        expect(loadedPosts2[0]!.id).toEqual(firstPost.id);
        expect(loadedPosts2[0]!.title).toEqual("Post");
        expect(loadedPosts2[0]!.text).toEqual("Everything about post #1");

        const loadedPosts3 = await postRepository.find({ where: { title: "Post" }, order: { text: -1 } });
        expect(loadedPosts3[0])!.toBeInstanceOf(Post);
        expect(loadedPosts3[0]!.id).toEqual(secondPost.id);
        expect(loadedPosts3[0]!.title).toEqual("Post");
        expect(loadedPosts3[0]!.text).toEqual("Everything about post #2");

        const loadedPosts4 = await postRepository.find({ where: { title: "Post" }, order: { text: "DESC" } });
        expect(loadedPosts4[0])!.toBeInstanceOf(Post);
        expect(loadedPosts4[0]!.id).toEqual(secondPost.id);
        expect(loadedPosts4[0]!.title).toEqual("Post");
        expect(loadedPosts4[0]!.text).toEqual("Everything about post #2");
    })));

});
