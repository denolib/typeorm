import "reflect-metadata";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../../utils/test-utils";
import {Connection} from "../../../../src";
import {User} from "./entity/User";
import {Category} from "./entity/Category";
import {Post} from "./entity/Post";
import {Photo} from "./entity/Photo";
import {Counters} from "./entity/Counters";

describe("repository > find options > relations", () => {

    // -------------------------------------------------------------------------
    // Configuration
    // -------------------------------------------------------------------------

    let connections: Connection[];
    beforeAll(async () => connections = await createTestingConnections({
        entities: [__dirname + "/entity/*{.js,.ts}"],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    // -------------------------------------------------------------------------
    // Setup
    // -------------------------------------------------------------------------

    beforeEach(() => Promise.all(connections.map(async connection => {
        const postUser = new User();
        postUser.name = "Timber";
        await connection.manager.save(postUser);
        const postCountersUser = new User();
        postCountersUser.name = "Post Counters Timber";
        await connection.manager.save(postCountersUser);
        const photoCountersUser = new User();
        photoCountersUser.name = "Photo Counters Timber";
        await connection.manager.save(photoCountersUser);
        const photoUser = new User();
        photoUser.name = "Photo Timber";
        await connection.manager.save(photoUser);

        const category1 = new Category();
        category1.name = "category1";
        await connection.manager.save(category1);
        const category2 = new Category();
        category2.name = "category2";
        await connection.manager.save(category2);

        const photo1 = new Photo();
        photo1.filename = "photo1.jpg";
        photo1.counters = new Counters();
        photo1.counters.stars = 2;
        photo1.counters.commentCount = 19;
        photo1.counters.author = photoCountersUser;
        photo1.user = photoUser;
        await connection.manager.save(photo1);
        const photo2 = new Photo();
        photo2.filename = "photo2.jpg";
        photo2.counters = new Counters();
        photo2.counters.stars = 3;
        photo2.counters.commentCount = 20;
        await connection.manager.save(photo2);
        const photo3 = new Photo();
        photo3.filename = "photo3.jpg";
        photo3.counters = new Counters();
        photo3.counters.stars = 4;
        photo3.counters.commentCount = 21;
        await connection.manager.save(photo3);

        const postCounters = new Counters();
        postCounters.commentCount = 1;
        postCounters.author = postCountersUser;
        postCounters.stars = 101;

        const post = new Post();
        post.title = "About Timber";
        post.counters = postCounters;
        post.user = postUser;
        post.categories = [category1, category2];
        post.photos = [photo1, photo2, photo3];
        await connection.manager.save(post);
    })));

    // -------------------------------------------------------------------------
    // Specifications
    // -------------------------------------------------------------------------

    test("should not any relations if they are not specified", () => Promise.all(connections.map(async connection => {
        const loadedPost = await connection.getRepository(Post).findOne(1);
        expect(loadedPost)!.toEqual({
            id: 1,
            title: "About Timber",
            counters: {
                commentCount: 1,
                stars: 101
            }
        });
    })));

    test("should load specified relations case 1", () => Promise.all(connections.map(async connection => {
        const loadedPost = await connection.getRepository(Post).findOne(1, { relations: ["photos"] });
        expect(loadedPost!.id).toEqual(1);
        expect(loadedPost!.title).toEqual("About Timber");
        expect(loadedPost!.counters.commentCount).toEqual(1);
        expect(loadedPost!.counters.stars).toEqual(101);

        expect(loadedPost!.photos).toContainEqual({
            id: 1,
            filename: "photo1.jpg",
            counters: {
                stars: 2,
                commentCount: 19
            }
        });
        expect(loadedPost!.photos).toContainEqual({
            id: 2,
            filename: "photo2.jpg",
            counters: {
                stars: 3,
                commentCount: 20
            }
        });
        expect(loadedPost!.photos).toContainEqual({
            id: 3,
            filename: "photo3.jpg",
            counters: {
                stars: 4,
                commentCount: 21
            }
        });
    })));

    test("should load specified relations case 2", () => Promise.all(connections.map(async connection => {
        const loadedPost = await connection.getRepository(Post).findOne(1, { relations: ["photos", "user", "categories"] });
        expect(loadedPost!.id).toEqual(1);
        expect(loadedPost!.title).toEqual("About Timber");
        expect(loadedPost!.counters.commentCount).toEqual(1);
        expect(loadedPost!.counters.stars).toEqual(101);
        expect(loadedPost!.photos).toContainEqual({
            id: 1,
            filename: "photo1.jpg",
            counters: {
                stars: 2,
                commentCount: 19
            }
        });
        expect(loadedPost!.photos).toContainEqual({
            id: 2,
            filename: "photo2.jpg",
            counters: {
                stars: 3,
                commentCount: 20
            }
        });
        expect(loadedPost!.photos).toContainEqual({
            id: 3,
            filename: "photo3.jpg",
            counters: {
                stars: 4,
                commentCount: 21
            }
        });
        expect(loadedPost!.user).toEqual({
            id: 1,
            name: "Timber"
        });
        expect(loadedPost!.categories).toContainEqual({
            id: 1,
            name: "category1"
        });
        expect(loadedPost!.categories).toContainEqual({
            id: 2,
            name: "category2"
        });
    })));

    test("should load specified relations and their sub-relations case 1", () => Promise.all(connections.map(async connection => {
        const loadedPost = await connection.getRepository(Post).findOne(1, { relations: ["photos", "user", "categories", "photos.user"] });
        expect(loadedPost!.id).toEqual(1);
        expect(loadedPost!.title).toEqual("About Timber");
        expect(loadedPost!.counters.commentCount).toEqual(1);
        expect(loadedPost!.counters.stars).toEqual(101);
        expect(loadedPost!.photos).toContainEqual({
            id: 1,
            filename: "photo1.jpg",
            counters: {
                stars: 2,
                commentCount: 19
            },
            user: {
                id: 4,
                name: "Photo Timber"
            }
        });
        expect(loadedPost!.photos).toContainEqual({
            id: 2,
            filename: "photo2.jpg",
            counters: {
                stars: 3,
                commentCount: 20
            },
            user: null
        });
        expect(loadedPost!.photos).toContainEqual({
            id: 3,
            filename: "photo3.jpg",
            counters: {
                stars: 4,
                commentCount: 21
            },
            user: null
        });
        expect(loadedPost!.user).toEqual({
            id: 1,
            name: "Timber"
        });
        expect(loadedPost!.categories).toContainEqual({
            id: 1,
            name: "category1"
        });
        expect(loadedPost!.categories).toContainEqual({
            id: 2,
            name: "category2"
        });
    })));

    test("should load specified relations and their sub-relations case 2", () => Promise.all(connections.map(async connection => {
        const loadedPost = await connection.getRepository(Post).findOne(1, { relations: ["photos", "user", "photos.user", "counters.author"] });
        expect(loadedPost!.id).toEqual(1);
        expect(loadedPost!.title).toEqual("About Timber");
        expect(loadedPost!.counters.commentCount).toEqual(1);
        expect(loadedPost!.counters.stars).toEqual(101);
        expect(loadedPost!.photos).toContainEqual({
            id: 1,
            filename: "photo1.jpg",
            counters: {
                stars: 2,
                commentCount: 19
            },
            user: {
                id: 4,
                name: "Photo Timber"
            }
        });
        expect(loadedPost!.photos).toContainEqual({
            id: 2,
            filename: "photo2.jpg",
            counters: {
                stars: 3,
                commentCount: 20
            },
            user: null
        });
        expect(loadedPost!.photos).toContainEqual({
            id: 3,
            filename: "photo3.jpg",
            counters: {
                stars: 4,
                commentCount: 21
            },
            user: null
        });
        expect(loadedPost!.user).toEqual({
            id: 1,
            name: "Timber"
        });
        expect(loadedPost!.counters.author).toEqual({
            id: 2,
            name: "Post Counters Timber"
        });
    })));

    test("should load specified relations and their sub-relations case 3", () => Promise.all(connections.map(async connection => {
        const loadedPost = await connection.getRepository(Post).findOne(1, { relations: ["photos", "user", "photos.user", "counters.author", "photos.counters.author"] });
        expect(loadedPost!.id).toEqual(1);
        expect(loadedPost!.title).toEqual("About Timber");
        expect(loadedPost!.counters.commentCount).toEqual(1);
        expect(loadedPost!.counters.stars).toEqual(101);
        expect(loadedPost!.photos).toContainEqual({
            id: 1,
            filename: "photo1.jpg",
            counters: {
                stars: 2,
                commentCount: 19,
                author: {
                    id: 3,
                    name: "Photo Counters Timber"
                }
            },
            user: {
                id: 4,
                name: "Photo Timber"
            }
        });
        expect(loadedPost!.photos).toContainEqual({
            id: 2,
            filename: "photo2.jpg",
            counters: {
                stars: 3,
                commentCount: 20,
                author: null
            },
            user: null
        });
        expect(loadedPost!.photos).toContainEqual({
            id: 3,
            filename: "photo3.jpg",
            counters: {
                stars: 4,
                commentCount: 21,
                author: null
            },
            user: null
        });
        expect(loadedPost!.user).toEqual({
            id: 1,
            name: "Timber"
        });
        expect(loadedPost!.counters.author).toEqual({
            id: 2,
            name: "Post Counters Timber"
        });
    })));

    test("should throw error if specified relations were not found case 1", () => Promise.all(connections.map(async connection => {
        await expect(
            connection
                .getRepository(Post)
                .findOne(1, { relations: ["photos2"] })
        ).rejects.toBeDefined();
    })));

    test("should throw error if specified relations were not found case 2", () => Promise.all(connections.map(async connection => {
        await expect(
            connection
                .getRepository(Post)
                .findOne(1, { relations: ["photos", "counters.author2"] })
        ).rejects.toBeDefined();
    })));

    test("should throw error if specified relations were not found case 3", () => Promise.all(connections.map(async connection => {
        await await expect(
            connection
                .getRepository(Post)
                .findOne(1, { relations: ["photos", "counters2.author"] })
        ).rejects.toBeDefined();
    })));

    test("should throw error if specified relations were not found case 4", () => Promise.all(connections.map(async connection => {
        await await expect(
            connection
                .getRepository(Post)
                .findOne(1, { relations: ["photos", "photos.user.haha"] })
        ).rejects.toBeDefined();
    })));

    test("should throw error if specified relations were not found case 5", () => Promise.all(connections.map(async connection => {
        await await expect(
            connection
                .getRepository(Post)
                .findOne(1, { relations: ["questions"] })
        ).rejects.toBeDefined();
    })));

    test("should throw error if specified relations were not found case 6", () => Promise.all(connections.map(async connection => {
        await await expect(
            connection
                .getRepository(Post)
                .findOne(1, { relations: ["questions.haha"] })
        ).rejects.toBeDefined();
    })));

});
