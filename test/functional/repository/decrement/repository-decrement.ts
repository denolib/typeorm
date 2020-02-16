import { runIfMain } from "../../../deps/mocha.ts";
import { expect } from "../../../deps/chai.ts";
import { closeTestingConnections, createTestingConnections, reloadTestingDatabases } from "../../../utils/test-utils.ts";
import { Connection } from "../../../../src/connection/Connection.ts";
import { UpdateResult } from "../../../../src/index.ts";
import { Post } from "./entity/Post.ts";
import { PostBigInt } from "./entity/PostBigInt.ts";
import { UserWithEmbededEntity } from "./entity/UserWithEmbededEntity.ts";

describe("repository > decrement method", () => {

    describe("basic", () => {

        let connections: Connection[];
        before(async () => connections = await createTestingConnections({
            entities: [Post]
        }));
        beforeEach(() => reloadTestingDatabases(connections));
        after(() => closeTestingConnections(connections));

        it("should decrement value", () => Promise.all(connections.map(async connection => {

            // save few dummy posts
            const post1 = new Post();
            post1.id = 1;
            post1.title = "post #1";
            post1.counter = 2;
            const post2 = new Post();
            post2.id = 2;
            post2.title = "post #2";
            post2.counter = 5;
            await connection.manager.save([post1, post2]);

            // decrement counter of post 1
            await connection
                .getRepository(Post)
                .decrement({ id: 1 }, "counter", 1);

            // decrement counter of post 2
            await connection
                .manager
                .decrement(Post, { id: 2 }, "counter", 3);

            // load and check counter
            const loadedPost1 = await connection.manager.findOne(Post, 1);
            loadedPost1!.counter.should.be.equal(1);

            const loadedPost2 = await connection.manager.findOne(Post, 2);
            loadedPost2!.counter.should.be.equal(2);
        })));

        it("should accept string as input and decrement value", () => Promise.all(connections.map(async connection => {

            // save few dummy posts
            const post1 = new Post();
            post1.id = 1;
            post1.title = "post #1";
            post1.counter = 23;
            const post2 = new Post();
            post2.id = 2;
            post2.title = "post #2";
            post2.counter = 35;
            await connection.manager.save([post1, post2]);

            // decrement counter of post 1
            await connection
                .getRepository(Post)
                .decrement({ id: 1 }, "counter", "22");

            // decrement counter of post 2
            await connection
                .manager
                .decrement(Post, { id: 2 }, "counter", "33");

            // load and check counter
            const loadedPost1 = await connection.manager.findOne(Post, 1);
            loadedPost1!.counter.should.be.equal(1);

            const loadedPost2 = await connection.manager.findOne(Post, 2);
            loadedPost2!.counter.should.be.equal(2);
        })));

        it("should return UpdateResult", () => Promise.all(connections.map(async connection => {

            // save few dummy posts
            const post1 = new Post();
            post1.id = 1;
            post1.title = "post #1";
            post1.counter = 50;
            await connection.manager.save(post1);

            // increment counter of post 1
            const result = await connection
                .getRepository(Post)
                .decrement({ id: 1 }, "counter", 22);

            result.should.be.an.instanceOf(UpdateResult);

        })));

        it("should throw an error if column property path was not found", () => Promise.all(connections.map(async connection => {

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

            // decrement counter of post 1
            let error;
            try {
                await connection
                    .getRepository(Post)
                    .decrement({ id: 1 }, "unknownProperty", 1);
            } catch (err) {
                error = err;
            }
            expect(error).to.be.instanceOf(Error);

        })));

        it("should throw an error if input value is not number", () => Promise.all(connections.map(async connection => {

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

            // decrement counter of post 1
            let error;
            try {
                await connection
                    .getRepository(Post)
                    .decrement({ id: 1 }, "counter", "12abc");
            } catch (err) {
                error = err;
            }
            expect(error).to.be.instanceOf(Error);

        })));

    });

    describe("bigint", () => {

        let connections: Connection[];
        before(async () => connections = await createTestingConnections({
            entities: [PostBigInt],
            enabledDrivers: ["mysql", "mariadb", "postgres"],
            // logging: true
        }));
        beforeEach(() => reloadTestingDatabases(connections));
        after(() => closeTestingConnections(connections));

        it("should decrement value", () => Promise.all(connections.map(async connection => {

            // save few dummy posts
            const postBigInt1 = new PostBigInt();
            postBigInt1.id = 1;
            postBigInt1.title = "post #1";
            postBigInt1.counter = "9000000000000000001";
            const postBigInt2 = new PostBigInt();
            postBigInt2.id = 2;
            postBigInt2.title = "post #2";
            postBigInt2.counter = "9000000000000000002";
            await connection.manager.save([postBigInt1, postBigInt2]);

            // decrement counter of post 1
            await connection
                .getRepository(PostBigInt)
                .decrement({ id: 1 }, "counter", "9000000000000000000");

            // decrement counter of post 2
            await connection
                .manager
                .decrement(PostBigInt, { id: 2 }, "counter", "9000000000000000000");

            // load and check counter
            const loadedPost1 = await connection.manager.findOne(PostBigInt, 1);
            loadedPost1!.counter.should.be.equal("1");

            const loadedPost2 = await connection.manager.findOne(PostBigInt, 2);
            loadedPost2!.counter.should.be.equal("2");

        })));

    });


    describe("embeded entities", () => {

        let connections: Connection[];
        before(async () => connections = await createTestingConnections({
            entities: [UserWithEmbededEntity],
        }));
        beforeEach(() => reloadTestingDatabases(connections));
        after(() => closeTestingConnections(connections));

        it("should decrement value", () => Promise.all(connections.map(async connection => {

            const userWithEmbededEntity = new UserWithEmbededEntity();
            userWithEmbededEntity.id = 1;
            await connection.manager.save([userWithEmbededEntity]);

            await connection
                .getRepository(UserWithEmbededEntity)
                .decrement({ id: 1 }, "friend.sent", 15);

            const loadedUser = await connection.manager.findOne(UserWithEmbededEntity, 1);
            loadedUser!.friend.sent.should.be.equal(-15);

        })));

    });

});

runIfMain(import.meta);
