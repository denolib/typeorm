import {runIfMain} from "../../deps/mocha.ts";
import {expect} from "../../deps/chai.ts";
import {Post} from "./entity/Post.ts";
import {Guest as GuestV1} from "./entity/v1/Guest.ts";
import {Comment as CommentV1} from "./entity/v1/Comment.ts";
import {Guest as GuestV2} from "./entity/v2/Guest.ts";
import {Comment as CommentV2} from "./entity/v2/Comment.ts";
import {View} from "./entity/View.ts";
import {Category} from "./entity/Category.ts";
import {closeTestingConnections, createTestingConnections, setupSingleTestingConnection} from "../../utils/test-utils.ts";
import {Connection} from "../../../src/connection/Connection.ts";
import {Repository} from "../../../src/repository/Repository.ts";
import {TreeRepository} from "../../../src/repository/TreeRepository.ts";
import {getConnectionManager} from "../../../src/index.ts";
import {NoConnectionForRepositoryError} from "../../../src/error/NoConnectionForRepositoryError.ts";
import {EntityManager} from "../../../src/entity-manager/EntityManager.ts";
import {CannotGetEntityManagerNotConnectedError} from "../../../src/error/CannotGetEntityManagerNotConnectedError.ts";
import {ConnectionOptions} from "../../../src/connection/ConnectionOptions.ts";
// import {PostgresConnectionOptions} from "../../../src/driver/postgres/PostgresConnectionOptions.ts";
import {PromiseUtils} from "../../../src/util/PromiseUtils.ts";

describe("Connection", () => {
    // const resourceDir = __dirname + "/../../../../../test/functional/connection/";

    describe("before connection is established", function() {

        let connection: Connection;
        before(async () => {
            const options = setupSingleTestingConnection("mysql", {
                name: "default",
                entities: []
            });
            if (!options)
                return;

            connection = getConnectionManager().create(options);
        });
        after(() => {
            if (connection && connection.isConnected)
                return connection.close();

            return Promise.resolve();
        });

        it("connection.isConnected should be false", () => {
            if (!connection)
                return;

            connection.isConnected.should.be.false;
        });

        it.skip("entity manager and reactive entity manager should not be accessible", () => {
            expect(() => connection.manager).to.throw(CannotGetEntityManagerNotConnectedError);
            // expect(() => connection.reactiveEntityManager).to.throw(CannotGetEntityManagerNotConnectedError);
        });

        // todo: they aren't promises anymore
        /*it("import entities, entity schemas, subscribers and naming strategies should work", () => {
         return Promise.all([
         connection.importEntities([Post]).should.be.fulfilled,
         connection.importEntitySchemas([]).should.be.fulfilled,
         connection.importSubscribers([]).should.be.fulfilled,
         connection.importNamingStrategies([]).should.be.fulfilled,
         connection.importEntitiesFromDirectories([]).should.be.fulfilled,
         connection.importEntitySchemaFromDirectories([]).should.be.fulfilled,
         connection.importSubscribersFromDirectories([]).should.be.fulfilled,
         connection.importNamingStrategiesFromDirectories([]).should.be.fulfilled
         ]);
         });*/

        it("should not be able to close", async () => {
            if (!connection)
                return;
            try {
                await connection.close(); // CannotCloseNotConnectedError
                expect.fail("an error to be thrown");
            } catch (err) {
                expect(err.message).not.to.be.equal("an error to be thrown");
            }
        });

        it("should not be able to sync a schema", async () => {
            if (!connection)
                return;
            try {
                await connection.synchronize(); // CannotCloseNotConnectedError
                expect.fail("an error to be thrown");
            } catch (err) {
                expect(err.message).not.to.equal("an error to be thrown");
            }
        });

        it.skip("should not be able to use repositories", () => {
            if (!connection)
                return;

            expect(() => connection.getRepository(Post)).to.throw(NoConnectionForRepositoryError);
            expect(() => connection.getTreeRepository(Category)).to.throw(NoConnectionForRepositoryError);
            // expect(() => connection.getReactiveRepository(Post)).to.throw(NoConnectionForRepositoryError);
            // expect(() => connection.getReactiveTreeRepository(Category)).to.throw(NoConnectionForRepositoryError);
        });

        it("should be able to connect", async () => {
            if (!connection)
                return;
            await connection.connect();
        });

    });

    describe.skip("establishing connection", function() {
        it("should throw DriverOptionNotSetError when extra.socketPath and host is missing", function() {
            expect(() => {
                getConnectionManager().create(<ConnectionOptions>{
                    type: "mysql",
                    username: "test",
                    password: "test",
                    database: "test",
                    entities: [],
                    dropSchema: false,
                    schemaCreate: false,
                    enabledDrivers: ["mysql"],
                });
            }).to.throw(Error);
        });
    });

    describe("after connection is established successfully", function() {

        let connections: Connection[];
        beforeEach(() => createTestingConnections({ entities: [Post, Category], schemaCreate: true, dropSchema: true }).then(all => connections = all));
        afterEach(() => closeTestingConnections(connections));

        it("connection.isConnected should be true", () => connections.forEach(connection => {
            connection.isConnected.should.be.true;
        }));

        it("entity manager and reactive entity manager should be accessible", () => connections.forEach(connection => {
            expect(connection.manager).to.be.instanceOf(EntityManager);
            // expect(connection.reactiveEntityManager).to.be.instanceOf(ReactiveEntityManager);
        }));

        it("should not be able to connect again", () => connections.forEach(async connection => {
            try {
                await connection.connect(); // CannotConnectAlreadyConnectedError
                expect.fail("an error to be thrown");
            } catch (err) {
                expect(err.message).not.to.equal("an error to be thrown");
            }
        }));

        it("should be able to close a connection", async () => Promise.all(connections.map(connection => {
            return connection.close();
        })));

    });

    describe("working with repositories after connection is established successfully", function() {

        let connections: Connection[];
        before(() => createTestingConnections({ entities: [Post, Category], schemaCreate: true, dropSchema: true }).then(all => connections = all));
        after(() => closeTestingConnections(connections));

        it("should be able to get simple entity repository", () => connections.forEach(connection => {
            connection.getRepository(Post).should.be.instanceOf(Repository);
            connection.getRepository(Post).should.not.be.instanceOf(TreeRepository);
            connection.getRepository(Post).target.should.be.eql(Post);
        }));

        it("should be able to get tree entity repository", () => connections.forEach(connection => {
            connection.getTreeRepository(Category).should.be.instanceOf(TreeRepository);
            connection.getTreeRepository(Category).target.should.be.eql(Category);
        }));

        // it("should be able to get simple entity reactive repository", () => connections.forEach(connection => {
        //     connection.getReactiveRepository(Post).should.be.instanceOf(ReactiveRepository);
        //     connection.getReactiveRepository(Post).should.not.be.instanceOf(TreeReactiveRepository);
        //     connection.getReactiveRepository(Post).target.should.be.eql(Post);
        // }));

        // it("should be able to get tree entity reactive repository", () => connections.forEach(connection => {
        //     connection.getReactiveTreeRepository(Category).should.be.instanceOf(TreeReactiveRepository);
        //     connection.getReactiveTreeRepository(Category).target.should.be.eql(Category);
        // }));

        it("should not be able to get tree entity repository of the non-tree entities", () => connections.forEach(connection => {
            expect(() => connection.getTreeRepository(Post)).to.throw(Error); // RepositoryNotTreeError
            // expect(() => connection.getReactiveTreeRepository(Post)).to.throw(RepositoryNotTreeError);
        }));

        it("should not be able to get repositories that are not registered", () => connections.forEach(connection => {
            expect(() => connection.getRepository("SomeEntity")).to.throw(Error); // RepositoryNotTreeError
            expect(() => connection.getTreeRepository("SomeEntity")).to.throw(Error); // RepositoryNotTreeError
            // expect(() => connection.getReactiveRepository("SomeEntity")).to.throw(RepositoryNotFoundError);
            // expect(() => connection.getReactiveTreeRepository("SomeEntity")).to.throw(RepositoryNotFoundError);
        }));

    });

    describe("generate a schema when connection.syncSchema is called", function() {

        let connections: Connection[];
        before(() => createTestingConnections({ entities: [Post], schemaCreate: true, dropSchema: true }).then(all => connections = all));
        after(() => closeTestingConnections(connections));

        it("database should be empty after schema is synced with dropDatabase flag", () => Promise.all(connections.map(async connection => {
            const postRepository = connection.getRepository(Post);
            const post = new Post();
            post.title = "new post";
            await postRepository.save(post);
            const loadedPost = await postRepository.findOne(post.id);
            expect(loadedPost).to.be.eql(post);
            await connection.synchronize(true);
            const againLoadedPost = await postRepository.findOne(post.id);
            expect(againLoadedPost).to.be.undefined;
        })));

    });

    describe("log a schema when connection.logSyncSchema is called", function() {

        let connections: Connection[];
        before(async () => connections = await createTestingConnections({
            entities: [Post]
        }));
        after(() => closeTestingConnections(connections));

        it("should return sql log properly", () => Promise.all(connections.map(async connection => {
            await connection.driver.createSchemaBuilder().log();
            // console.log(sql);
        })));

    });

    describe("after connection is closed successfully", function() {

        // open a close connections
        let connections: Connection[] = [];
        before(() => createTestingConnections({ entities: [Post], schemaCreate: true, dropSchema: true }).then(all => {
            connections = all;
            return Promise.all(connections.map(connection => connection.close()));
        }));

        it("should not be able to close already closed connection", () => connections.forEach(async connection => {
            try {
                await connection.close(); // CannotCloseNotConnectedError
                expect.fail("an error to be thrown");
            } catch (err) {
                expect(err.message).not.to.equal("an error to be thrown");
            }
        }));

        it("connection.isConnected should be false", () => connections.forEach(connection => {
            connection.isConnected.should.be.false;
        }));

    });

    describe("skip schema generation when synchronize option is set to false", function() {

        let connections: Connection[];
        beforeEach(() => createTestingConnections({ entities: [View], dropSchema: true }).then(all => connections = all));
        afterEach(() => closeTestingConnections(connections));
        it("database should be empty after schema sync", () => Promise.all(connections.map(async connection => {
            await connection.synchronize(true);
            const queryRunner = connection.createQueryRunner();
            let schema = await queryRunner.getTables(["view"]);
            await queryRunner.release();
            expect(schema.some(table => table.name === "view")).to.be.false;
        })));

    });

    describe("different names of the same content of the schema", () => {

        let connections: Connection[];
        beforeEach(async () => {
            const connections1 = await createTestingConnections({
                name: "test",
                enabledDrivers: ["postgres"],
                entities: [CommentV1, GuestV1],
                schema: "test-schema",
                dropSchema: true,
            });
            const connections2 = await createTestingConnections({
                name: "another",
                enabledDrivers: ["postgres"],
                entities: [CommentV1, GuestV1],
                schema: "another-schema",
                dropSchema: true
            });
            connections = [...connections1, ...connections2];
        });
        after(() => closeTestingConnections(connections));

        it("should not interfere with each other", async () => {
            await PromiseUtils.runInSequence(connections, c => c.synchronize());
            await closeTestingConnections(connections);
            const connections1 = await createTestingConnections({
                name: "test",
                enabledDrivers: ["postgres"],
                entities: [CommentV2, GuestV2],
                schema: "test-schema",
                dropSchema: false,
                schemaCreate: true
            });
            const connections2 = await createTestingConnections({
                name: "another",
                enabledDrivers: ["postgres"],
                entities: [CommentV2, GuestV2],
                schema: "another-schema",
                dropSchema: false,
                schemaCreate: true
            });
            connections = [...connections1, ...connections2];
        });
    });

    describe("can change postgres default schema name", () => {
        let connections: Connection[];
        beforeEach(async () => {
            const connections1 = await createTestingConnections({
                name: "test",
                enabledDrivers: ["postgres"],
                entities: [CommentV1, GuestV1],
                schema: "test-schema",
                dropSchema: true,
            });
            const connections2 = await createTestingConnections({
                name: "another",
                enabledDrivers: ["postgres"],
                entities: [CommentV1, GuestV1],
                schema: "another-schema",
                dropSchema: true
            });
            connections = [...connections1, ...connections2];
        });
        afterEach(() => closeTestingConnections(connections));

        it("schema name can be set", () => {
            return Promise.all(connections.map(async connection => {
                await connection.synchronize(true);
                // TODO(uki00a) remove `any` when `PostgresDriver` is implemented.
                const schemaName = (connection.options as /*PostgresConnectionOptions*/any).schema;
                const comment = new CommentV1();
                comment.title = "Change SchemaName";
                comment.context = `To ${schemaName}`;

                const commentRepo = connection.getRepository(CommentV1);
                await commentRepo.save(comment);

                const queryRunner = connection.createQueryRunner();
                const rows = await queryRunner.query(`select * from "${schemaName}"."comment" where id = $1`, [comment.id]);
                await queryRunner.release();
                expect(rows[0]["context"]).to.be.eq(comment.context);
            }));

        });

    });

});

runIfMain(import.meta);
