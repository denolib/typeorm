import "reflect-metadata";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils";
import {Connection} from "../../../src";
import {Post} from "./entity/Post";

describe("github issues > #3374 Synchronize issue with UUID (MySQL)", () => {

    let connections: Connection[];
    beforeAll(async () => connections = await createTestingConnections({
        entities: [__dirname + "/entity/*{.js,.ts}"],
        subscribers: [__dirname + "/subscriber/*{.js,.ts}"],
        enabledDrivers: ["mysql"]
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("should not drop primary column again", () => Promise.all(connections.map(async function(connection) {

        const post = new Post();
        post.id = 1;
        post.name = "hello world";
        await connection.manager.save(post);

        await connection.synchronize();

        const loadedPost = await connection.manager.find(Post, { name: "hello world" });
        expect(loadedPost).toBeDefined();

    })));

});
