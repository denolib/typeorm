// This test is simply copied from test/functional/sqljs/startup.ts
import {runIfMain} from "../../deps/mocha.ts";
import {expect} from "../../deps/chai.ts";
import * as path from "../../../vendor/https/deno.land/std/path/mod.ts";
import {Post} from "../sqljs/entity/Post.ts";
import {createConnection} from "../../../src/index.ts";
import {Connection} from "../../../src/connection/Connection.ts";
import {getDirnameOfCurrentModule} from "../../utils/test-utils.ts";
import {PlatformTools} from "../../../src/platform/PlatformTools.ts";

describe("sqlite driver > startup", () => {
    let connection!: Connection;
    const __dirname = getDirnameOfCurrentModule(import.meta);
    const pathToSqlite = path.resolve(__dirname, "startup.sqlite");

    before(async () => connection = await createConnection({
        name: "sqlite",
        type: "sqlite",
        database: pathToSqlite,
        entities: [Post],
        synchronize: true,
        dropSchema: true,
        autoSave: true
    }));
    beforeEach(() => connection.synchronize(true));
    after(() => {
        if (connection.isConnected) {
            return connection.close();
        }
    });

    it("should startup even if the file doesn't exist", () => {
        // if we come this far, test was successful as a connection was established
        expect(connection).to.not.be.null;
    });

    it("should write a new file after first write operation", async () => {
        let post = new Post();
        post.title = "The title";

        const repository = connection.getRepository(Post);
        await repository.save(post);

        expect(PlatformTools.fileExist(pathToSqlite)).to.be.true;
    });
});

runIfMain(import.meta);

