import "reflect-metadata";
import { closeTestingConnections, createTestingConnections, reloadTestingDatabases } from "../../../../test/utils/test-utils";
import { Connection } from "../../../../src";
import { UpdateResult } from "../../../../src";
import { Post } from "./entity/Post";
import { PostBigInt } from "./entity/PostBigInt";
import { UserWithEmbededEntity } from "./entity/UserWithEmbededEntity";

describe("repository > increment method", () => {

    describe("basic", () => {

        let connections: Connection[];
        beforeAll(async () => connections = await createTestingConnections({
            entities: [Post]
        }));
        beforeEach(() => reloadTestingDatabases(connections));
        afterAll(() => closeTestingConnections(connections));

        test("should increment value", () => Promise.all(connections.map(async connection => {

            // save few dummy posts
            const post1 = new Post();
            post1.id = 1;
            post1.title = "post #1";
            post1.counter = 1;
            const post2 = new Post();
            post2.id = 2;
            post2.title = "post #2";
            post2.counter = 1;
            await connection.manager.save([post1, post2]);

            // increment counter of post 1
            await connection
                .getRepository(Post)
                .increment({ id: 1 }, "counter", 1);

            // increment counter of post 2
            await connection
                .manager
                .increment(Post, { id: 2 }, "counter", 3);

            // load and check counter
            const loadedPost1 = await connection.manager.findOne(Post, 1);
            expect(loadedPost1!.counter).toEqual(2);

            const loadedPost2 = await connection.manager.findOne(Post, 2);
            expect(loadedPost2!.counter).toEqual(4);
        })));

        test("should accept string as input and increment value", () => Promise.all(connections.map(async connection => {

            // save few dummy posts
            const post1 = new Post();
            post1.id = 1;
            post1.title = "post #1";
            post1.counter = 1;
            const post2 = new Post();
            post2.id = 2;
            post2.title = "post #2";
            post2.counter = 1;
            await connection.manager.save([post1, post2]);

            // increment counter of post 1
            await connection
                .getRepository(Post)
                .increment({ id: 1 }, "counter", "22");

            // increment counter of post 2
            await connection
                .manager
                .increment(Post, { id: 2 }, "counter", "33");

            // load and check counter
            const loadedPost1 = await connection.manager.findOne(Post, 1);
            expect(loadedPost1!.counter).toEqual(23);

            const loadedPost2 = await connection.manager.findOne(Post, 2);
            expect(loadedPost2!.counter).toEqual(34);
        })));

        test("should return UpdateResult", () => Promise.all(connections.map(async connection => {

            // save few dummy posts
            const post1 = new Post();
            post1.id = 1;
            post1.title = "post #1";
            post1.counter = 1;
            await connection.manager.save(post1);

            // increment counter of post 1
            const result = await connection
                .getRepository(Post)
                .increment({ id: 1 }, "counter", 22);

            expect(result).toBeInstanceOf(UpdateResult);

        })));

        test("should throw an error if column property path was not found", () => Promise.all(connections.map(async connection => {

            // save few dummy posts
            const post1 = new Post();
            post1.id = 1;
            post1.title = "post #1";
            post1.counter = 1;
            const post2 = new Post();
            post2.id = 2;
            post2.title = "post #2";
            post2.counter = 1;
            await connection.manager.save([post1, post2]);

            // increment counter of post 1
            await expect(
                connection
                    .getRepository(Post)
                    .increment({ id: 1 }, "unknownProperty", 1)
            ).rejects.toBeDefined();

        })));

        test("should throw an error if input value is not number", () => Promise.all(connections.map(async connection => {

            // save few dummy posts
            const post1 = new Post();
            post1.id = 1;
            post1.title = "post #1";
            post1.counter = 1;
            const post2 = new Post();
            post2.id = 2;
            post2.title = "post #2";
            post2.counter = 1;
            await connection.manager.save([post1, post2]);

            // increment counter of post 1
            await expect(
                connection
                    .getRepository(Post)
                    .increment({ id: 1 }, "counter", "12abc")
            ).rejects.toBeDefined();

        })));

    });

    describe("bigint", () => {

        let connections: Connection[];
        beforeAll(async () => connections = await createTestingConnections({
            entities: [PostBigInt],
            enabledDrivers: ["mysql", "mariadb", "postgres"],
            // logging: true
        }));
        beforeEach(() => reloadTestingDatabases(connections));
        afterAll(() => closeTestingConnections(connections));

        test("should increment value", () => Promise.all(connections.map(async connection => {

            // save few dummy posts
            const postBigInt1 = new PostBigInt();
            postBigInt1.id = 1;
            postBigInt1.title = "post #1";
            postBigInt1.counter = "1";
            const postBigInt2 = new PostBigInt();
            postBigInt2.id = 2;
            postBigInt2.title = "post #2";
            postBigInt2.counter = "2";
            await connection.manager.save([postBigInt1, postBigInt2]);

            // increment counter of post 1
            await connection
                .getRepository(PostBigInt)
                .increment({ id: 1 }, "counter", "9000000000000000000");

            // increment counter of post 2
            await connection
                .manager
                .increment(PostBigInt, { id: 2 }, "counter", "9000000000000000000");

            // load and check counter
            const loadedPost1 = await connection.manager.findOne(PostBigInt, 1);
            expect(loadedPost1!.counter).toEqual("9000000000000000001");

            const loadedPost2 = await connection.manager.findOne(PostBigInt, 2);
            expect(loadedPost2!.counter).toEqual("9000000000000000002");

        })));

    });


    describe("embeded entities", () => {

        let connections: Connection[];
        beforeAll(async () => connections = await createTestingConnections({
            entities: [UserWithEmbededEntity],
        }));
        beforeEach(() => reloadTestingDatabases(connections));
        afterAll(() => closeTestingConnections(connections));

        test("should increment value", () => Promise.all(connections.map(async connection => {

            const userWithEmbededEntity = new UserWithEmbededEntity();
            userWithEmbededEntity.id = 1;
            await connection.manager.save([userWithEmbededEntity]);

            await connection
                .getRepository(UserWithEmbededEntity)
                .increment({ id: 1 }, "friend.sent", 5);

            const loadedUser = await connection.manager.findOne(UserWithEmbededEntity, 1);
            expect(loadedUser!.friend.sent).toEqual(5);

        })));

    });

});
