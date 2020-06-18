import {runIfMain} from "../../../../deps/mocha.ts";
import {expect} from "../../../../deps/chai.ts";
import {Connection} from "../../../../../src/connection/Connection.ts";
import {EntityMetadataValidator} from "../../../../../src/metadata-builder/EntityMetadataValidator.ts";
import {ConnectionMetadataBuilder} from "../../../../../src/connection/ConnectionMetadataBuilder.ts";
import {Post} from "./entity/Post.ts";
import {Profile} from "./entity/Profile.ts";
import {User} from "./entity/User.ts";

describe("relations > eager relations > circular eager relations", () => {

    it("should throw error if eager: true is set on both sides of relationship", async () => {
        const connection = new Connection({ // dummy connection options, connection won't be established anyway
            // TODO(uki00a) Replace sqlite with mysql when MysqlDriver is implemeneted.
        /*
            type: "mysql",
            host: "localhost",
            username: "test",
            password: "test",
            database: "test",
            */
            type: "sqlite",
            database: ":memory:",
            entities: [Post, Profile, User]
        });
        const connectionMetadataBuilder = new ConnectionMetadataBuilder(connection);
        const entityMetadatas = await connectionMetadataBuilder.buildEntityMetadatas([Post, Profile, User]);
        const entityMetadataValidator = new EntityMetadataValidator();
        expect(() => entityMetadataValidator.validateMany(entityMetadatas, connection.driver)).to.throw(Error);
    });

});

runIfMain(import.meta);
