import "reflect-metadata";
import * as fs from "fs";
import * as path from "path";
import {getSqljsManager} from "../../../src";
import {Connection} from "../../../src";
import {Post} from "./entity/Post";
import {
    closeTestingConnections,
    createTestingConnections,
    reloadTestingDatabases
} from "../../utils/test-utils";

describe("sqljs driver > save", () => {

    const pathToSqlite = path.resolve(__dirname, "export.sqlite");
    let connections: Connection[];
    beforeAll(async () => connections = await createTestingConnections({
        entities: [Post],
        schemaCreate: true,
        dropSchema: true,
        enabledDrivers: ["sqljs"]
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("should save to file", () => Promise.all(connections.map(async connection => {
        if (fs.existsSync(pathToSqlite)) {
            fs.unlinkSync(pathToSqlite);
        }

        let post = new Post();
        post.title = "The second title";

        const repository = connection.getRepository(Post);
        await repository.save(post);
        const manager = getSqljsManager("sqljs");

        await manager.saveDatabase(pathToSqlite);
        expect(fs.existsSync(pathToSqlite)).toBeTruthy();
    })));

    test("should load a file that was saved", () => Promise.all(connections.map(async connection => {
        const manager = getSqljsManager("sqljs");
        await manager.loadDatabase(pathToSqlite);

        const repository = connection.getRepository(Post);
        const post = await repository.findOne({title: "The second title"});

        expect(post).not.toBeUndefined();
        if (post) {
            expect(post.title).toEqual("The second title");
        }
    })));
});
