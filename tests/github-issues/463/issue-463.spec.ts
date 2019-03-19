import "reflect-metadata";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../../test/utils/test-utils";
import {Connection} from "../../../src";
import {Post} from "./entity/Post";

describe("github issues > #463 saving empty string array", () => {

    let connections: Connection[];
    beforeAll(async () => connections = await createTestingConnections({
        entities: [__dirname + "/entity/*{.js,.ts}"],
        enabledDrivers: ["postgres"],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("should not return array with single empty string if empty array was saved", () => Promise.all(connections.map(async connection => {
        const post = new Post();
        post.names = [];
        await connection.getRepository(Post).save(post);
        const loadedPost = await connection.getRepository(Post).findOne(1);
        expect(loadedPost!.names.length).toEqual(0);
    })));

});
