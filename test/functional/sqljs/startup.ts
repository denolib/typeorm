import {runIfMain} from "../../deps/mocha.ts";
import {expect} from "../../deps/chai.ts";
import * as path from "../../../vendor/https/deno.land/std/path/mod.ts";
import {Post} from "./entity/Post.ts";
import {Connection} from "../../../src/connection/Connection.ts";
import {getDirnameOfCurrentModule, closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils.ts";
import {PlatformTools} from "../../../src/platform/PlatformTools.ts";

// TODO(uki00a) Remove `.skip` when SqljsDriver is implemented.
describe.skip("sqljs driver > startup", () => {
    let connections: Connection[];
    const __dirname = getDirnameOfCurrentModule(import.meta);
    const pathToSqlite = path.resolve(__dirname, "startup.sqlite");

    before(async () => connections = await createTestingConnections({
        entities: [Post],
        schemaCreate: true,
        dropSchema: true,
        enabledDrivers: ["sqljs"],
        driverSpecific: {
            autoSave: true,
            location: pathToSqlite,
        }
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("should startup even if the file doesn't exist", () => Promise.all(connections.map(async connection => {
        // if we come this far, test was successful as a connection was established
        expect(connection).to.not.be.null;
    })));

    it("should write a new file after first write operation", () => Promise.all(connections.map(async connection => {
        let post = new Post();
        post.title = "The title";

        const repository = connection.getRepository(Post);
        await repository.save(post);

        expect(PlatformTools.fileExist(pathToSqlite)).to.be.true;
    })));
});

runIfMain(import.meta);
