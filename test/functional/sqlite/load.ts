// This test is copied from test/functional/sqljs/load.ts
import {join as joinPaths} from "../../../vendor/https/deno.land/std/path/mod.ts";
import {runIfMain} from "../../deps/mocha.ts";
import {expect} from "../../deps/chai.ts";
import {getSqliteManager} from "../../../src/index.ts";
import {getDirnameOfCurrentModule, closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils.ts";
import {Connection} from "../../../src/connection/Connection.ts";
import {Post} from "../sqljs/entity/Post.ts";

describe("sqlite driver > load", () => {

    let connections: Connection[];
    const dirname = getDirnameOfCurrentModule(import.meta);
    before(async () => connections = await createTestingConnections({
        entities: [Post],
        schemaCreate: true,
        dropSchema: true,
        enabledDrivers: ["sqlite"]
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("should load from a file", () => Promise.all(connections.map(async connection => {
        const manager = getSqliteManager("sqlite");
        const databasePath = joinPaths(dirname, "../sqljs/sqlite/test.sqlite");
        await manager.loadDatabase(databasePath);

        const repository = connection.getRepository(Post);
        const post = await repository.findOne({title: "A post"});

        expect(post).not.to.be.undefined;
        if (post) {
            expect(post.title).to.be.equal("A post");
        }

        const exportedDatabase = manager.exportDatabase();
        expect(exportedDatabase).not.to.be.undefined;
        const originalFileContent = Deno.readFileSync(databasePath);
        expect(exportedDatabase.length).to.equal(originalFileContent.length);
    })));

    it("should throw an error if the file doesn't exist", () => Promise.all(connections.map(async connection => {
        const manager = getSqliteManager("sqlite");
        try {
            const databasePath = joinPaths(dirname, "../sqljs/sqlite/test2.sqlite");
            await manager.loadDatabase(databasePath);
            expect(true).to.be.false;
        } catch (error) {
            expect(error.message.match(/File .* does not exist/) !== null).to.equal(true, "Should throw: File does not exist");
        }
    })));
});

runIfMain(import.meta);

