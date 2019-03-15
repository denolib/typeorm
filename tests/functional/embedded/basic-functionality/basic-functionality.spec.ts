import "reflect-metadata";
import {Post} from "./entity/Post";
import {Counters} from "./entity/Counters";
import {Connection} from "../../../../src";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../../../test/utils/test-utils";

describe("embedded > basic functionality", () => {

    let connections: Connection[];
    beforeAll(async () => connections = await createTestingConnections({
        entities: [__dirname + "/entity/*{.js,.ts}"],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("should insert, load, update and remove entities with embeddeds properly", () => Promise.all(connections.map(async connection => {
        const postRepository = connection.getRepository(Post);

        const post = new Post();
        post.title = "Hello post";
        post.text = "This is text about the post";
        post.counters = new Counters();
        post.counters.comments = 5;
        post.counters.favorites = 2;
        post.counters.likes = 1;

        await postRepository.save(post);

        // now load it
        const loadedPost = (await postRepository.findOne(post.id))!;
        expect(loadedPost.title).toEqual("Hello post");
        expect(loadedPost.text).toEqual("This is text about the post");
        expect(loadedPost.counters).toEqual({
            comments: 5,
            favorites: 2,
            likes: 1
        });

        // now update the post
        loadedPost.counters.favorites += 1;

        await postRepository.save(loadedPost);

        // now check it
        const loadedPost2 = (await postRepository.findOne(post.id))!;
        expect(loadedPost2.title).toEqual("Hello post");
        expect(loadedPost2.text).toEqual("This is text about the post");
        expect(loadedPost2.counters).toEqual({
            comments: 5,
            favorites: 3,
            likes: 1
        });

        await postRepository.remove(loadedPost2);

        // now check it
        const loadedPost3 = (await postRepository.findOne(post.id))!;
        expect(loadedPost3).toBeUndefined();
    })));

});
