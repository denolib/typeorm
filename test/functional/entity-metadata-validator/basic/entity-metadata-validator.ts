import {join as joinPaths} from "../../../../vendor/https/deno.land/std/path/mod.ts";
import {Connection} from "../../../../src/connection/Connection.ts";
import {ConnectionMetadataBuilder} from "../../../../src/connection/ConnectionMetadataBuilder.ts";
import {EntityMetadataValidator} from "../../../../src/metadata-builder/EntityMetadataValidator.ts";
import {getDirnameOfCurrentModule} from "../../../utils/test-utils.ts";
import {expect} from "../../../deps/chai.ts";
import {runIfMain} from "../../../deps/mocha.ts";
import {Category} from "./entity/Category.ts";
import {Post} from "./entity/Post.ts";

describe("entity-metadata-validator", () => {

    it("should throw error if relation count decorator used with ManyToOne or OneToOne relations", async function() {
        const __dirname = getDirnameOfCurrentModule(import.meta);
        const connection = new Connection({ // dummy connection options, connection won't be established anyway
            // TODO(uki00a) uncomment this when MysqlDriver is implemented.
            /*
            type: "mysql",
            host: "localhost",
            username: "test",
            password: "test",
            database: "test",
            entities: [joinPaths(__dirname, "/entity/*.ts")]
            */
            type: "sqlite",
            database: ":memory:",
            entities: [Category, Post]
        });
        const connectionMetadataBuilder = new ConnectionMetadataBuilder(connection);
        const entityMetadatas = await connectionMetadataBuilder.buildEntityMetadatas([joinPaths(__dirname, "/entity/*.ts")]);
        const entityMetadataValidator = new EntityMetadataValidator();
        expect(() => entityMetadataValidator.validateMany(entityMetadatas, connection.driver)).to.throw(Error);
    });

});

runIfMain(import.meta);
