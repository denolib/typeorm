import "reflect-metadata";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../../test/utils/test-utils";
import {Connection} from "../../../src";
import {Post} from "./entity/Post";

describe("github issues > #433 default value (json) is not getting set in postgreSQL", () => {

    let connections: Connection[];
    beforeAll(async () => connections = await createTestingConnections({
        entities: [__dirname + "/entity/*{.js,.ts}"],
        enabledDrivers: ["postgres"],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("should successfully set default value in to JSON type column", () => Promise.all(connections.map(async connection => {
        const post = new Post();
        post.id = 1;
        await connection.getRepository(Post).save(post);
        const loadedPost = (await connection.getRepository(Post).findOne(1))!;
        expect(loadedPost.json).toEqual({ hello: "world" });
    })));

});
