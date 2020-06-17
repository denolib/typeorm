import {runIfMain} from "../../deps/mocha.ts";
import {expect} from "../../deps/chai.ts";
import { createTestingConnections, closeTestingConnections } from "../../utils/test-utils.ts";
import { Connection } from "../../../src/index.ts";
import { Post } from "./entity/Post.ts";
import { Post as PostSucceed } from "./entity/Post-Succeed.ts";
import { Post as PostFail } from "./entity/Post-Fail.ts";

describe("mssql -> add column to existing table", () => {
    let connections: Connection[];

    beforeEach(async () => {
        connections = (await createTestingConnections({
            enabledDrivers: ["mssql"],
            entities: [Post]
        }));
        await Promise.all(connections.map(async connection => {
            await connection.synchronize(true);
            await connection.getRepository("Post").insert({ title: "test" });
            await connection.close();
        }));
    });

    afterEach(async () => {
        await closeTestingConnections(connections);
    });

    it("should fail to add column", async () => {
        connections = (await createTestingConnections({
            enabledDrivers: ["mssql"],
            entities: [PostFail]
        }));
        await Promise.all(connections.map(async connection => {
            let error;
            try {
            await connection.synchronize();
            } catch (err) {
                error = err;
            }
            expect(error).to.be.instanceOf(Error);
            expect(error.message).to.equal("Error: ALTER TABLE only allows columns to be added that can contain nulls, or have a DEFAULT definition specified, or the column being added is an identity or timestamp column, or alternatively if none of the previous conditions are satisfied the table must be empty to allow addition of this column. Column 'addedField' cannot be added to non-empty table 'post' because it does not satisfy these conditions.");
        }));
    });

    it("should succeed to add column", async () => {
        connections = (await createTestingConnections({
            enabledDrivers: ["mssql"],
            entities: [PostSucceed]
        }));

        await Promise.all(connections.map(async connection => {
            expect(await connection.synchronize()).to.be.undefined;
            const post = await connection.getRepository<PostSucceed>("Post").findOne();
            if (!post) {
                throw "Post should exist";
            }
            post.should.exist;
            post.id.should.be.eq(1);
            post.title.should.be.eq("test");
            post.addedField.should.be.eq("default value");
        }));
    });
});

runIfMain(import.meta);
