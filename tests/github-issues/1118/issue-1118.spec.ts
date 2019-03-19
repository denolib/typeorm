import "reflect-metadata";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils";
import {Connection} from "../../../src";
import {Post} from "./entity/Post";

describe("github issues > #1118 findByIds must return empty results if no criteria were passed in an array", () => {

    let connections: Connection[];
    beforeAll(async () => connections = await createTestingConnections({
        entities: [__dirname + "/entity/*{.js,.ts}"],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("drivers which does not support offset without limit should throw an exception, other drivers must work fine", () => Promise.all(connections.map(async connection => {
        const post = new Post();
        post.name = "post #1";
        await connection.manager.save(post);

        await expect(connection.manager.findByIds(Post, [1])).resolves.toEqual([{
            id: 1,
            name: "post #1"
        }]);

        await expect(connection.manager.findByIds(Post, [])).resolves.toEqual([]);
    })));

});
