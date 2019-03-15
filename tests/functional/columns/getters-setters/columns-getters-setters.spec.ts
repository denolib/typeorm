import "reflect-metadata";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../../../test/utils/test-utils";
import {Connection} from "../../../../src";
import {Post} from "./entity/Post";

describe("columns > getters and setters", () => {

    let connections: Connection[];
    beforeAll(async () => connections = await createTestingConnections({
        entities: [Post],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("should not update columns marked with readonly property", () => Promise.all(connections.map(async connection => {

        const postRepository = connection.getRepository(Post);

        // create and save a post first
        const post = new Post();
        post.title = "hello";
        await postRepository.save(post);

        // check if title is a value applied by a setter
        const loadedPost1 = await postRepository.findOne(post.id);
        expect(loadedPost1!.title).toEqual("bye");

        // try to load a column by its value
        const loadedPost2 = await postRepository.findOne({ title: "bye" });
        expect(loadedPost2!.title).toEqual("bye");

    })));


});
