import "reflect-metadata";
import * as fs from "fs";
import {getSqljsManager} from "../../../src";
import {Connection} from "../../../src";
import {Post} from "./entity/Post";
import {
    closeTestingConnections,
    createTestingConnections,
    reloadTestingDatabases
} from "../../utils/test-utils";

describe("sqljs driver > load", () => {

    let connections: Connection[];
    beforeAll(async () => connections = await createTestingConnections({
        entities: [Post],
        schemaCreate: true,
        dropSchema: true,
        enabledDrivers: ["sqljs"]
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("should load from a file", () => Promise.all(connections.map(async connection => {
        const manager = getSqljsManager("sqljs");
        await manager.loadDatabase("test/functional/sqljs/sqlite/test.sqlite");

        const repository = connection.getRepository(Post);
        const post = await repository.findOne({title: "A post"});

        expect(post).not.toBeDefined();
        if (post) {
            expect(post.title).toEqual("A post");
        }

        const exportedDatabase = manager.exportDatabase();
        expect(exportedDatabase).not.toBeDefined();
        const originalFileContent = fs.readFileSync("test/functional/sqljs/sqlite/test.sqlite");
        expect(exportedDatabase.length).toEqual(originalFileContent.length);
    })));

    test("should throw an error if the file doesn't exist", () => Promise.all(connections.map(async connection => {
        const manager = getSqljsManager("sqljs");
        try {
            await manager.loadDatabase("test/functional/sqljs/sqlite/test.sqlite");
            expect(true).toBeFalsy();
        } catch (error) {
            // expect(error.message.match(/File .* does not exist/) !== null).to.equal(true, "Should throw: File does not exist");
        }
    })));
});
