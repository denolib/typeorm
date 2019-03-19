import "reflect-metadata";
import {Connection} from "../../src";
import {Post} from "../../sample/sample1-simple-entity/entity/Post";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../utils/test-utils";

describe("insertion", function() {

    // -------------------------------------------------------------------------
    // Setup
    // -------------------------------------------------------------------------

    let connections: Connection[];
    beforeAll(async () => connections = await createTestingConnections({
        entities: [Post],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    // -------------------------------------------------------------------------
    // Specifications: persist
    // -------------------------------------------------------------------------

    test("basic insert functionality", () => Promise.all(connections.map(async connection => {
        const postRepository = connection.getRepository(Post);

        let newPost = new Post();
        newPost.text = "Hello post";
        newPost.title = "this is post title";
        newPost.likesCount = 0;
        const savedPost = await postRepository.save(newPost);

        expect(savedPost).toEqual(newPost);
        expect(savedPost.id).not.toBeUndefined();

        const insertedPost = await postRepository.findOne(savedPost.id);
        expect(insertedPost)!.toEqual({
            id: savedPost.id,
            text: "Hello post",
            title: "this is post title",
            likesCount: 0
        });
    })));

});
