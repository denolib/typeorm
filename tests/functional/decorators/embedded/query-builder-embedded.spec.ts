import "reflect-metadata";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../../utils/test-utils";
import {Connection} from "../../../../src";
import {Post} from "./entity/Post";
import {Counters} from "./entity/Counters";

describe("decorators > embedded", () => {

    let connections: Connection[];
    beforeEach(() => createTestingConnections({
        entities: [Post, Counters]
    }).then(all => connections = all));
    beforeEach(() => reloadTestingDatabases(connections));
    afterEach(() => closeTestingConnections(connections));

    describe("basic functionality", function() {

        test("should persist and load entities with embeddeds properly", () => Promise.all(connections.map(async connection => {
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
            expect(loadedPost.id).toEqual(post.id);
            expect(loadedPost.title).toEqual("Hello post");
            expect(loadedPost.text).toEqual("This is text about the post");
            expect(loadedPost.counters).toEqual({
                comments: 5,
                favorites: 2,
                likes: 1
            });

        })));

        test("should be used with prop", () => Promise.all(connections.map(async connection => {
            const postRepository = connection.getRepository(Post);

            const post1 = new Post();
            post1.title = "Hello post #1";
            post1.text = "This is text about the post";
            post1.counters = new Counters();
            post1.counters.comments = 5;
            post1.counters.favorites = 2;
            post1.counters.likes = 1;

            await postRepository.save(post1);

            const post2 = new Post();
            post2.title = "Hello post #2";
            post2.text = "This is text about the post";
            post2.counters = new Counters();
            post2.counters.comments = 6;
            post2.counters.favorites = 1;
            post2.counters.likes = 2;

            await postRepository.save(post2);

            // now load it
            const sortedPosts1 = await postRepository
                .createQueryBuilder("post")
                .orderBy("post.counters.comments", "DESC")
                .getMany();

            expect(sortedPosts1).toEqual([{
                id: post2.id,
                title: "Hello post #2",
                text: "This is text about the post",
                counters: {
                    comments: 6,
                    favorites: 1,
                    likes: 2
                }
            }, {
                id: post1.id,
                title: "Hello post #1",
                text: "This is text about the post",
                counters: {
                    comments: 5,
                    favorites: 2,
                    likes: 1
                }
            }]);

            // check another order
            const sortedPosts2 = await postRepository
                .createQueryBuilder("post")
                .orderBy("post.counters.favorites", "DESC")
                .getMany();

            expect(sortedPosts2).toEqual([{
                id: post1.id,
                title: "Hello post #1",
                text: "This is text about the post",
                counters: {
                    comments: 5,
                    favorites: 2,
                    likes: 1
                }
            }, {
                id: post2.id,
                title: "Hello post #2",
                text: "This is text about the post",
                counters: {
                    comments: 6,
                    favorites: 1,
                    likes: 2
                }
            }]);

        })));

    });

});
