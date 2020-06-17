import {join as joinPaths} from "../../../../vendor/https/deno.land/std/path/mod.ts";
import {getDirnameOfCurrentModule, closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../../utils/test-utils.ts";
import {Connection} from "../../../../src/connection/Connection.ts";
import {Post} from "./entity/Post.ts";
import {Category} from "./entity/Category.ts";
import {Details} from "./entity/Details.ts";
import {Photo} from "./entity/Photo.ts";
import {ConnectionMetadataBuilder} from "../../../../src/connection/ConnectionMetadataBuilder.ts";
import {EntityMetadataValidator} from "../../../../src/metadata-builder/EntityMetadataValidator.ts";
import {expect} from "../../../deps/chai.ts";
import {runIfMain} from "../../../deps/mocha.ts";

describe("persistence > order of persistence execution operations", () => {

    const __dirname = getDirnameOfCurrentModule(import.meta);

    describe("should throw exception when non-resolvable circular relations found", function() {

        it("should throw CircularRelationsError", async () => {
            const connection = new Connection({ // dummy connection options, connection won't be established anyway
                // TODO(uki00a) uncomment this when MysqlDriver is implemented.
                /*
                type: "mysql",
                host: "localhost",
                username: "test",
                password: "test",
                database: "test",
                */
                type: "sqlite",
                database: ":memory:",
                entities: [Category, Details, Photo, Post]
            });
            const connectionMetadataBuilder = new ConnectionMetadataBuilder(connection);
            const entityMetadatas = await connectionMetadataBuilder.buildEntityMetadatas([joinPaths(__dirname, "/entity/*.ts")]);
            const entityMetadataValidator = new EntityMetadataValidator();
            expect(() => entityMetadataValidator.validateMany(entityMetadatas, connection.driver)).to.throw(Error);
        });


    });

    describe.skip("should persist all entities in correct order", function() {

        let connections: Connection[];
        before(async () => connections = await createTestingConnections({
            entities: [joinPaths(__dirname, "/entity/*.ts")],
        }));
        beforeEach(() => reloadTestingDatabases(connections));
        after(() => closeTestingConnections(connections));
        it("", () => Promise.all(connections.map(async connection => {

            // create first category and post and save them
            const category1 = new Category();
            category1.name = "Category saved by cascades #1";

            const post1 = new Post();
            post1.title = "Hello Post #1";
            post1.category = category1;

            await connection.manager.save(post1);

            // now check
            /*const posts = await connection.manager.find(Post, {
             alias: "post",
             innerJoinAndSelect: {
             category: "post.category"
             },
             orderBy: {
             "post.id": "ASC"
             }
             });

             posts.should.be.eql([{
             id: 1,
             title: "Hello Post #1",
             category: {
             id: 1,
             name: "Category saved by cascades #1"
             }
             }, {
             id: 2,
             title: "Hello Post #2",
             category: {
             id: 2,
             name: "Category saved by cascades #2"
             }
             }]);*/
        })));
    });



});

runIfMain(import.meta);
