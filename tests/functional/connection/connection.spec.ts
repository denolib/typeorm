import "reflect-metadata";
import {Post} from "./entity/Post";
import {Guest as GuestV1} from "./entity/v1/Guest";
import {Comment as CommentV1} from "./entity/v1/Comment";
import {Guest as GuestV2} from "./entity/v2/Guest";
import {Comment as CommentV2} from "./entity/v2/Comment";
import {View} from "./entity/View";
import {Category} from "./entity/Category";
import {closeTestingConnections, createTestingConnections, setupSingleTestingConnection} from "../../../test/utils/test-utils";
import {Connection} from "../../../src";
import {Repository} from "../../../src";
import {TreeRepository} from "../../../src";
import {getConnectionManager} from "../../../src";
import {NoConnectionForRepositoryError} from "../../../src/error/NoConnectionForRepositoryError";
import {EntityManager} from "../../../src";
import {CannotGetEntityManagerNotConnectedError} from "../../../src/error/CannotGetEntityManagerNotConnectedError";
import {ConnectionOptions} from "../../../src";
import {PostgresConnectionOptions} from "../../../src/driver/postgres/PostgresConnectionOptions";
import {PromiseUtils} from "../../../src";

describe("Connection", () => {
    // const resourceDir = __dirname + "/../../../../../test/functional/connection/";

    describe("before connection is established", function() {

        let connection: Connection;
        beforeAll(async () => {
            const options = setupSingleTestingConnection("mysql", {
                name: "default",
                entities: []
            });
            if (!options)
                return;

            connection = getConnectionManager().create(options);
        });
        afterAll(() => {
            if (connection && connection.isConnected)
                return connection.close();

            return Promise.resolve();
        });

        test("connection.isConnected should be false", () => {
            if (!connection)
                return;

            expect(connection.isConnected).toBeFalsy();
        });

        test.skip("entity manager and reactive entity manager should not be accessible", () => {
            expect(() => connection.manager).toThrow(CannotGetEntityManagerNotConnectedError);
            // expect(() => connection.reactiveEntityManager).toThrow(CannotGetEntityManagerNotConnectedError);
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

        test("should not be able to close", () => {
            if (!connection)
                return;
            return expect(connection.close()).rejects.toBeDefined(); // CannotCloseNotConnectedError
        });

        test("should not be able to sync a schema", () => {
            if (!connection)
                return;
            return expect(connection.synchronize()).rejects.toBeDefined(); // CannotCloseNotConnectedError
        });

        test.skip("should not be able to use repositories", () => {
            if (!connection)
                return;

            expect(() => connection.getRepository(Post)).toThrow(NoConnectionForRepositoryError);
            expect(() => connection.getTreeRepository(Category)).toThrow(NoConnectionForRepositoryError);
            // expect(() => connection.getReactiveRepository(Post)).to.throw(NoConnectionForRepositoryError);
            // expect(() => connection.getReactiveTreeRepository(Category)).to.throw(NoConnectionForRepositoryError);
        });

        test("should be able to connect", () => {
            if (!connection)
                return;
            return expect(connection.connect()).resolves.toBeDefined();
        });

    });

    describe.skip("establishing connection", function() {
        test("should throw DriverOptionNotSetError when extra.socketPath and host is missing", function() {
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
            }).toThrow(Error);
        });
    });

    describe("after connection is established successfully", function() {

        let connections: Connection[];
        beforeEach(() => createTestingConnections({ entities: [Post, Category], schemaCreate: true, dropSchema: true }).then(all => connections = all));
        afterEach(() => closeTestingConnections(connections));

        test("connection.isConnected should be true", () => connections.forEach(connection => {
            expect(connection.isConnected).toBeTruthy();
        }));

        test("entity manager and reactive entity manager should be accessible", () => connections.forEach(connection => {
            expect(connection.manager).toBeInstanceOf(EntityManager);
            // expect(connection.reactiveEntityManager).toBeInstanceOf(ReactiveEntityManager);
        }));

        test("should not be able to connect again", () => connections.forEach(connection => {
            return expect(connection.connect()).rejects.toBeDefined(); // CannotConnectAlreadyConnectedError
        }));

        test("should be able to close a connection", async () => Promise.all(connections.map(connection => {
            return connection.close();
        })));

    });

    describe("working with repositories after connection is established successfully", function() {

        let connections: Connection[];
        beforeAll(() => createTestingConnections({ entities: [Post, Category], schemaCreate: true, dropSchema: true }).then(all => connections = all));
        afterAll(() => closeTestingConnections(connections));

        test("should be able to get simple entity repository", () => connections.forEach(connection => {
            expect(connection.getRepository(Post)).toBeInstanceOf(Repository);
            expect(connection.getRepository(Post)).not.toBeInstanceOf(TreeRepository);
            expect(connection.getRepository(Post).target).toEqual(Post);
        }));

        test("should be able to get tree entity repository", () => connections.forEach(connection => {
            expect(connection.getTreeRepository(Category)).toBeInstanceOf(TreeRepository);
            expect(connection.getTreeRepository(Category).target).toEqual(Category);
        }));

        // test("should be able to get simple entity reactive repository", () => connections.forEach(connection => {
        //     expect(connection.getReactiveRepository(Post)).toBeInstanceOf(ReactiveRepository);
        //     expect(connection.getReactiveRepository(Post)).toBeInstanceOf(TreeReactiveRepository);
        //     expect(connection.getReactiveRepository(Post).target).toEqual(Post);
        // }));

        // test("should be able to get tree entity reactive repository", () => connections.forEach(connection => {
        //     expect(connection.getReactiveTreeRepository(Category)).toBeInstanceOf(TreeReactiveRepository);
        //     expect(connection.getReactiveTreeRepository(Category).target).toEqual(Category);
        // }));

        test("should not be able to get tree entity repository of the non-tree entities", () => connections.forEach(connection => {
            expect(() => connection.getTreeRepository(Post)).toThrow(Error); // RepositoryNotTreeError
            // expect(() => connection.getReactiveTreeRepository(Post)).toThrow(RepositoryNotTreeError);
        }));

        test("should not be able to get repositories that are not registered", () => connections.forEach(connection => {
            expect(() => connection.getRepository("SomeEntity")).toThrow(Error); // RepositoryNotTreeError
            expect(() => connection.getTreeRepository("SomeEntity")).toThrow(Error); // RepositoryNotTreeError
            // expect(() => connection.getReactiveRepository("SomeEntity")).to.throw(RepositoryNotFoundError);
            // expect(() => connection.getReactiveTreeRepository("SomeEntity")).to.throw(RepositoryNotFoundError);
        }));

    });

    describe("generate a schema when connection.syncSchema is called", function() {

        let connections: Connection[];
        beforeAll(() => createTestingConnections({ entities: [Post], schemaCreate: true, dropSchema: true }).then(all => connections = all));
        afterAll(() => closeTestingConnections(connections));

        test("database should be empty after schema is synced with dropDatabase flag", () => Promise.all(connections.map(async connection => {
            const postRepository = connection.getRepository(Post);
            const post = new Post();
            post.title = "new post";
            await postRepository.save(post);
            const loadedPost = await postRepository.findOne(post.id);
            expect(loadedPost).toEqual(post);
            await connection.synchronize(true);
            const againLoadedPost = await postRepository.findOne(post.id);
            expect(againLoadedPost).toBeUndefined();
        })));

    });

    describe("log a schema when connection.logSyncSchema is called", function() {

        let connections: Connection[];
        beforeAll(async () => connections = await createTestingConnections({
            entities: [Post]
        }));
        afterAll(() => closeTestingConnections(connections));

        test("should return sql log properly", () => Promise.all(connections.map(async connection => {
            await connection.driver.createSchemaBuilder().log();
            // console.log(sql);
        })));

    });

    describe("after connection is closed successfully", function() {

        // open a close connections
        let connections: Connection[] = [];
        beforeAll(() => createTestingConnections({ entities: [Post], schemaCreate: true, dropSchema: true }).then(all => {
            connections = all;
            return Promise.all(connections.map(connection => connection.close()));
        }));

        test("should not be able to close already closed connection", () => connections.forEach(connection => {
            return expect(connection.close()).rejects.toBeDefined(); // CannotCloseNotConnectedError
        }));

        test("connection.isConnected should be false", () => connections.forEach(connection => {
            expect(connection.isConnected).toBeFalsy();
        }));

    });

    describe("skip schema generation when synchronize option is set to false", function() {

        let connections: Connection[];
        beforeEach(() => createTestingConnections({ entities: [View], dropSchema: true }).then(all => connections = all));
        afterEach(() => closeTestingConnections(connections));
        test("database should be empty after schema sync", () => Promise.all(connections.map(async connection => {
            await connection.synchronize(true);
            const queryRunner = connection.createQueryRunner();
            let schema = await queryRunner.getTables(["view"]);
            await queryRunner.release();
            expect(schema.some(table => table.name === "view")).toBeFalsy();
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
        afterAll(() => closeTestingConnections(connections));

        test("should not interfere with each other", async () => {
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

        test("schema name can be set", () => {
            return Promise.all(connections.map(async connection => {
                await connection.synchronize(true);
                const schemaName = (connection.options as PostgresConnectionOptions).schema;
                const comment = new CommentV1();
                comment.title = "Change SchemaName";
                comment.context = `To ${schemaName}`;

                const commentRepo = connection.getRepository(CommentV1);
                await commentRepo.save(comment);

                const queryRunner = connection.createQueryRunner();
                const rows = await queryRunner.query(`select * from "${schemaName}"."comment" where id = $1`, [comment.id]);
                await queryRunner.release();
                expect(rows[0]["context"]).toEqual(comment.context);
            }));

        });

    });

});
