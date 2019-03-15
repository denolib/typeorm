import "reflect-metadata";
import {Connection} from "../../../../../src";
import {Post} from "./entity/Post";
import {
    closeTestingConnections,
    createTestingConnections,
    reloadTestingDatabases
} from "../../../../../test/utils/test-utils";

describe("mongodb > indices", () => {

    let connections: Connection[];
    beforeAll(async () => connections = await createTestingConnections({
        entities: [Post],
        enabledDrivers: ["mongodb"]
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("should insert entity with indices correctly", () => Promise.all(connections.map(async connection => {
        const postRepository = connection.getRepository(Post);

        // save a post
        const post = new Post();
        post.title = "Post";
        post.name = "About Post";
        await postRepository.save(post);

        // check saved post
        const loadedPost = await postRepository.findOne({ title: "Post" });

        expect(loadedPost).toBeDefined();
    })));

});
