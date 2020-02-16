import {runIfMain} from "../../deps/mocha.ts";
import {expect} from "../../deps/chai.ts";
import {getSqljsManager} from "../../../src/index.ts";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils.ts";
import {Connection} from "../../../src/connection/Connection.ts";
import {Post} from "./entity/Post.ts";

// TODO(uki00a) Remove `.skip` when SqljsDriver is implemented.
describe.skip("sqljs driver > load", () => {

    let connections: Connection[];
    before(async () => connections = await createTestingConnections({
        entities: [Post],
        schemaCreate: true,
        dropSchema: true,
        enabledDrivers: ["sqljs"]
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("should load from a file", () => Promise.all(connections.map(async connection => {
        const manager = getSqljsManager("sqljs");
        await manager.loadDatabase("test/functional/sqljs/sqlite/test.sqlite");

        const repository = connection.getRepository(Post);
        const post = await repository.findOne({title: "A post"});

        expect(post).not.to.be.undefined;
        if (post) {
            expect(post.title).to.be.equal("A post");
        }

        const exportedDatabase = manager.exportDatabase();
        expect(exportedDatabase).not.to.be.undefined;
        const originalFileContent = Deno.readFileSync("test/functional/sqljs/sqlite/test.sqlite");
        expect(exportedDatabase.length).to.equal(originalFileContent.length);
    })));

    it("should throw an error if the file doesn't exist", () => Promise.all(connections.map(async connection => {
        const manager = getSqljsManager("sqljs");
        try {
            await manager.loadDatabase("test/functional/sqljs/sqlite/test2.sqlite");
            expect(true).to.be.false;
        } catch (error) {
            expect(error.message.match(/File .* does not exist/) !== null).to.equal(true, "Should throw: File does not exist");
        }
    })));
});

runIfMain(import.meta);
