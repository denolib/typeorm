import "reflect-metadata";
import {setupSingleTestingConnection} from "../../../test/utils/test-utils";
import {ConnectionManager} from "../../../src";
import {MysqlDriver} from "../../../src/driver/mysql/MysqlDriver";
import {PrimaryGeneratedColumn} from "../../../src";
import {Column} from "../../../src";
import {Entity} from "../../../src";

describe("ConnectionManager", () => {

    @Entity()
    class Post {

        @PrimaryGeneratedColumn()
        id: number;

        @Column()
        title: string;

        constructor(id: number, title: string) {
            this.id = id;
            this.title = title;
        }
    }

    describe("create", function() {

        test("should create a mysql connection when mysql driver is specified", () => {

            const options = setupSingleTestingConnection("mysql", {
                name: "default",
                entities: []
            });
            if (!options)
                return;
            const connectionManager = new ConnectionManager();
            const connection = connectionManager.create(options);
            expect(connection.name).toEqual("default");
            expect(connection.driver).toBeInstanceOf(MysqlDriver);
            expect(connection.isConnected).toBeFalsy();
        });

       /* test("should create a postgres connection when postgres driver is specified", () => {
            const options: ConnectionOptions = {
                name: "myPostgresConnection",
                driver: createTestingConnectionOptions("postgres")
            };
            const connectionManager = new ConnectionManager();
            const connection = connectionManager.create(options);
            expect(connection.name)toEqual("myPostgresConnection");
            expect(connection.driver).toBeInstanceOf(PostgresDriver);
            expect(connection.isConnected).toBeFalsy();
        });*/

    });

    /*describe("createAndConnect", function() {

        test("should create a mysql connection when mysql driver is specified AND connect to it", async () => {
            const options: ConnectionOptions = setupSingleTestingConnection("mysql", {
                name: "default",
                entities: []
            });
            const connectionManager = new ConnectionManager();
            const connection = await connectionManager.createAndConnect(options);
            expect(connection.name).toEqual("default");
            expect(connection.driver).toBeInstanceOf(MysqlDriver);
            expect(connection.isConnected).toBeTruthy();
            await connection.close();
        });

    /!*    test("should create a postgres connection when postgres driver is specified AND connect to it", async () => {
            const options: ConnectionOptions = {
                name: "myPostgresConnection",
                driver: createTestingConnectionOptions("postgres")
            };
            const connectionManager = new ConnectionManager();
            const connection = await connectionManager.createAndConnect(options);
            expect(connection.name).toEqual("myPostgresConnection");
            expect(connection.driver).toBeInstanceOf(PostgresDriver);
            expect(connection.isConnected).toBeTruthy();
            await connection.close();
        });*!/

    });*/

    describe("get", function() {

        test("should give connection with a requested name", () => {
            const options = setupSingleTestingConnection("mysql", {
                name: "myMysqlConnection",
                entities: []
            });
            if (!options)
                return;
            const connectionManager = new ConnectionManager();
            const connection = connectionManager.create(options);
            expect(connection.driver).toBeInstanceOf(MysqlDriver);
            expect(connectionManager.get("myMysqlConnection")).toEqual(connection);
        });

        test("should throw an error if connection with the given name was not found", () => {
            const options = setupSingleTestingConnection("mysql", {
                name: "myMysqlConnection",
                entities: []
            });
            if (!options)
                return;
            const connectionManager = new ConnectionManager();
            const connection = connectionManager.create(options);
            expect(connection.driver).toBeInstanceOf(MysqlDriver);
            expect(() => connectionManager.get("myPostgresConnection")).toThrow(Error);
        });

    });

    describe("create connection options", function() {

        test("should not drop the database if dropSchema was not specified", async () => {
            const options = setupSingleTestingConnection("mysql", {
                name: "myMysqlConnection",
                schemaCreate: true,
                entities: [Post]
            });
            if (!options)
                return;

            const connectionManager = new ConnectionManager();

            // create connection, save post and close connection
            let connection = await connectionManager.create(options).connect();
            const post = new Post(1, "Hello post");
            await connection.manager.save(post);
            await connection.close();

            // recreate connection and find previously saved post
            connection = await connectionManager.create(options).connect();
            const loadedPost = (await connection.manager.findOne(Post, 1))!;
            expect(loadedPost).toBeInstanceOf(Post);
            expect(loadedPost).toEqual({ id: 1, title: "Hello post" });
            await connection.close();
        });

        test("should drop the database if dropSchema was set to true (mysql)", async () => {
            const options = setupSingleTestingConnection("mysql", {
                name: "myMysqlConnection",
                schemaCreate: true,
                dropSchema: true,
                entities: [Post]
            });
            if (!options)
                return;

            const connectionManager = new ConnectionManager();

            // create connection, save post and close connection
            let connection = await connectionManager.create(options).connect();
            const post = new Post(1, "Hello post");
            await connection.manager.save(post);
            await connection.close();

            // recreate connection and find previously saved post
            connection = await connectionManager.create(options).connect();
            const loadedPost = await connection.manager.findOne(Post, 1);
            expect(loadedPost).toBeUndefined();
            await connection.close();
         });

     /*   test("should drop the database if dropSchema was set to true (postgres)", async () => {
            const options: ConnectionOptions = {
                dropSchema: true,
                synchronize: true,
                driver: createTestingConnectionOptions("postgres"),
                entities: [Post]
            };
            const connectionManager = new ConnectionManager();

            // create connection, save post and close connection
            let connection = await connectionManager.createAndConnect(options);
            const post = new Post(1, "Hello post");
            await connection.manager.save(post);
            await connection.close();

            // recreate connection and find previously saved post
            connection = await connectionManager.createAndConnect(options);
            const loadedPost = await connection.manager.findOne(Post, 1);
            expect(loadedPost).toBeUndefined();

            await connection.close();
         });*/

    /*    test("should drop the database if dropSchema was set to true (postgres)", async () => {
            const options: ConnectionOptions = {
                dropSchema: true,
                synchronize: true,
                driver: createTestingConnectionOptions("postgres"),
                entities: [Post]
            };
            const connectionManager = new ConnectionManager();

            // create connection, save post and close connection
            let connection = await connectionManager.createAndConnect(options);
            const post = new Post(1, "Hello post");
            await connection.manager.save(post);
            await connection.close();

            // recreate connection and find previously saved post
            connection = await connectionManager.createAndConnect(options);
            const loadedPost = await connection.manager.findOne(Post, 1);
            expect(loadedPost).toBeUndefined();
            await connection.close();
         });*/

    });

});
