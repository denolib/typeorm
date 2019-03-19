import "reflect-metadata";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../../utils/test-utils";
import {Connection} from "../../../../src";
import {Post} from "./entity/Post";

describe("driver > convert raw results to entity", () => {

    let connections: Connection[];
    beforeAll(async () => connections = await createTestingConnections({
        entities: [Post],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("should return null value in entity property when record column is null", () => Promise.all(connections.map(async connection => {
        const postRepository = connection.getRepository(Post);
        const post = new Post();
        post.id = 1;

        await postRepository.save(post);

        const loadedPost = await postRepository.findOne(1);
        if (loadedPost) {
            expect(loadedPost.isNew).toEqual(null);
        }
    })));

    test("should return true in entity property when record column is true", () => Promise.all(connections.map(async connection => {
        const postRepository = connection.getRepository(Post);
        const post = new Post();
        post.id = 1;
        post.isNew = true;

        await postRepository.save(post);

        const loadedPost = await postRepository.findOne(1);
        if (loadedPost) {
            expect(loadedPost.isNew).toEqual(true);
        }
    })));

    test("should return false in entity property when record column is false", () => Promise.all(connections.map(async connection => {
        const postRepository = connection.getRepository(Post);
        const post = new Post();
        post.id = 1;
        post.isNew = false;

        await postRepository.save(post);

        const loadedPost = await postRepository.findOne(1);
        if (loadedPost) {
            expect(loadedPost.isNew).toEqual(false);
        }
    })));
});
