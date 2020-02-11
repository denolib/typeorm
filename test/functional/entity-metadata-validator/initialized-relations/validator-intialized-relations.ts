import {Connection} from "../../../../src/connection/Connection.ts";
import {ConnectionMetadataBuilder} from "../../../../src/connection/ConnectionMetadataBuilder.ts";
import {EntityMetadataValidator} from "../../../../src/metadata-builder/EntityMetadataValidator.ts";
import {expect} from "../../../deps/chai.ts";
import {runIfMain} from "../../../deps/mocha.ts";
import {InitializedRelationError} from "../../../../src/error/InitializedRelationError.ts";
import {Category} from "./entity/Category.ts";
import {Post} from "./entity/Post.ts";
import {Image} from "./entity/Image.ts";
import {ImageInfo} from "./entity/ImageInfo.ts";
import {Question} from "./entity/Question.ts";

describe("entity-metadata-validator > initialized relations", function() {
    this.timeout(20000); // This is because it takes some time to compile TypeScript.

    it("should throw error if relation with initialized array was found on many-to-many relation", async () => {
        const connection = new Connection({ // dummy connection options, connection won't be established anyway
            // TODO(uki00a) uncomment this when MysqlDriver is implemented.
            /*
            type: "mysql",
            host: "localhost",
            username: "test",
            password: "test",
            database: "test",
            entities: [Post, Category]
            */
            type: "sqlite",
            database: ":memory:",
            entities: [Post, Category]
        });
        const connectionMetadataBuilder = new ConnectionMetadataBuilder(connection);
        const entityMetadatas = await connectionMetadataBuilder.buildEntityMetadatas([Post, Category]);
        const entityMetadataValidator = new EntityMetadataValidator();
        expect(() => entityMetadataValidator.validateMany(entityMetadatas, connection.driver)).to.throw(InitializedRelationError);
    });

    it("should throw error if relation with initialized array was found on one-to-many relation", async () => {
        const connection = new Connection({ // dummy connection options, connection won't be established anyway
            // TODO(uki00a) uncomment this when MysqlDriver is implemented.
            /*
            type: "mysql",
            host: "localhost",
            username: "test",
            password: "test",
            database: "test",
            entities: [Image, ImageInfo]
            */
            type: "sqlite",
            database: ":memory:",
            entities: [Image, ImageInfo]
        });
        const connectionMetadataBuilder = new ConnectionMetadataBuilder(connection);
        const entityMetadatas = await connectionMetadataBuilder.buildEntityMetadatas([Image, ImageInfo]);
        const entityMetadataValidator = new EntityMetadataValidator();
        expect(() => entityMetadataValidator.validateMany(entityMetadatas, connection.driver)).to.throw(InitializedRelationError);
    });

    it("should not throw error if relation with initialized array was not found", async () => {
        const connection = new Connection({ // dummy connection options, connection won't be established anyway
            // TODO(uki00a) uncomment this when MysqlDriver is implemented.
            /*
            type: "mysql",
            host: "localhost",
            username: "test",
            password: "test",
            database: "test",
            entities: [Category]
            */
            type: "sqlite",
            database: ":memory:",
            entities: [Category]
        });
        const connectionMetadataBuilder = new ConnectionMetadataBuilder(connection);
        const entityMetadatas = await connectionMetadataBuilder.buildEntityMetadatas([Category]);
        const entityMetadataValidator = new EntityMetadataValidator();
        expect(() => entityMetadataValidator.validateMany(entityMetadatas, connection.driver)).not.to.throw(InitializedRelationError);
    });

    it("should not throw error if relation with initialized array was found, but persistence for this relation was disabled", async () => {
        const connection = new Connection({ // dummy connection options, connection won't be established anyway
            // TODO(uki00a) uncomment this when MysqlDriver is implemented.
            /*
            type: "mysql",
            host: "localhost",
            username: "test",
            password: "test",
            database: "test",
            entities: [Question, Category]
            */
            type: "sqlite",
            database: ":memory:",
            entities: [Question, Category]
        });
        const connectionMetadataBuilder = new ConnectionMetadataBuilder(connection);
        const entityMetadatas = await connectionMetadataBuilder.buildEntityMetadatas([Question, Category]);
        const entityMetadataValidator = new EntityMetadataValidator();
        expect(() => entityMetadataValidator.validateMany(entityMetadatas, connection.driver)).not.to.throw(InitializedRelationError);
    });

});

runIfMain(import.meta);
