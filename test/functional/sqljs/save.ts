import {runIfMain} from "../../deps/mocha.ts";
import {expect} from "../../deps/chai.ts";
import * as path from "../../../vendor/https/deno.land/std/path/mod.ts";
import * as fs from "../../../src/util/fs.ts";
import {getSqljsManager} from "../../../src/index.ts";
import {getDirnameOfCurrentModule, closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils.ts";
import {Connection} from "../../../src/connection/Connection.ts";
import {Post} from "./entity/Post.ts";

// TODO(uki00a) Remove `.skip` when SqljsDriver is implemented.
describe.skip("sqljs driver > save", () => {

    const __dirname = getDirnameOfCurrentModule(import.meta);
    const pathToSqlite = path.resolve(__dirname, "export.sqlite");
    let connections: Connection[];
    before(async () => connections = await createTestingConnections({
        entities: [Post],
        schemaCreate: true,
        dropSchema: true,
        enabledDrivers: ["sqljs"]
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("should save to file", () => Promise.all(connections.map(async connection => {
        if (fs.existsSync(pathToSqlite)) {
            Deno.removeSync(pathToSqlite);
        }

        let post = new Post();
        post.title = "The second title";

        const repository = connection.getRepository(Post);
        await repository.save(post);
        const manager = getSqljsManager("sqljs");

        await manager.saveDatabase(pathToSqlite);
        expect(fs.existsSync(pathToSqlite)).to.be.true;
    })));

    it("should load a file that was saved", () => Promise.all(connections.map(async connection => {
        const manager = getSqljsManager("sqljs");
        await manager.loadDatabase(pathToSqlite);

        const repository = connection.getRepository(Post);
        const post = await repository.findOne({title: "The second title"});

        expect(post).not.to.be.undefined;
        if (post) {
            expect(post.title).to.be.equal("The second title");
        }
    })));
});

runIfMain(import.meta);
