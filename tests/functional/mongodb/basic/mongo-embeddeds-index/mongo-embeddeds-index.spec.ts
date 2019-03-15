import "reflect-metadata";
import {Connection} from "../../../../../src";
import {Post} from "./entity/Post";
import {Information} from "./entity/Information";
import {
    closeTestingConnections,
    createTestingConnections,
    reloadTestingDatabases
} from "../../../../../test/utils/test-utils";

describe("mongodb > embeddeds indices", () => {

    let connections: Connection[];
    beforeAll(async () => connections = await createTestingConnections({
        entities: [Post],
        enabledDrivers: ["mongodb"]
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("should insert entity with embeddeds indices correctly", () => Promise.all(connections.map(async connection => {
        const postRepository = connection.getRepository(Post);

        // save a post
        const post = new Post();
        post.title = "Post";
        post.name = "About Post";
        post.info = new Information();
        post.info.description = "This a description";
        post.info.likes = 1000;
        await postRepository.save(post);

        // check saved post
        const loadedPost = await postRepository.findOne({title: "Post"});
        expect(loadedPost).toBeDefined();
    })));

});
