import "reflect-metadata";
import {Post} from "./entity/Post";
import {Counters} from "./entity/Counters";
import {Connection} from "../../../../src";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../../../test/utils/test-utils";

describe("embedded > prefix functionality", () => {

    let connections: Connection[];
    beforeAll(async () => connections = await createTestingConnections({
        entities: [__dirname + "/entity/*{.js,.ts}"],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("should insert, load, update and remove entities with embeddeds properly", () => Promise.all(connections.map(async connection => {
        const postRepository = connection.getRepository(Post);

        const post = new Post();
        post.id = 1;
        post.title = "Hello post";
        post.text = "This is text about the post";
        post.counters = new Counters();
        post.counters.comments = 5;
        post.counters.favorites = 2;
        post.counters.likes = 1;

        await postRepository.save(post);

        // now load it
        const loadedPost = (await postRepository.findOne(1))!;
        expect(loadedPost.id).toEqual(1);
        expect(loadedPost.title).toEqual("Hello post");
        expect(loadedPost.text).toEqual("This is text about the post");
        expect(loadedPost.counters).toEqual({
            comments: 5,
            favorites: 2,
            likes: 1
        });
    })));

});
