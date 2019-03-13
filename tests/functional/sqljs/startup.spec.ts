import "reflect-metadata";
import * as path from "path";
import {Post} from "./entity/Post";
import {Connection} from "../../../src";
import {PlatformTools} from "../../../src/platform/PlatformTools";
import {
    closeTestingConnections,
    createTestingConnections,
    reloadTestingDatabases
} from "../../../test/utils/test-utils";

describe("sqljs driver > startup", () => {
    let connections: Connection[];
    const pathToSqlite = path.resolve(__dirname, "startup.sqlite");

    beforeAll(async () => connections = await createTestingConnections({
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
    afterAll(() => closeTestingConnections(connections));

    test("should startup even if the file doesn't exist", () => Promise.all(connections.map(async connection => {
        // if we come this far, test was successful as a connection was established
        expect(connection).not.toBeNull();
    })));

    test("should write a new file after first write operation", () => Promise.all(connections.map(async connection => {
        let post = new Post();
        post.title = "The title";

        const repository = connection.getRepository(Post);
        await repository.save(post);

        expect(PlatformTools.fileExist(pathToSqlite)).toBeTruthy();
    })));
});
