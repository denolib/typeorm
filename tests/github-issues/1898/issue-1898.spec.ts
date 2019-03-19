import "reflect-metadata";
import {Connection} from "../../../src";
import {Post} from "./entity/Post";
import {closeTestingConnections, createTestingConnections} from "../../utils/test-utils";

describe("github issues > #1898 Simple JSON breaking in @next", () => {

    let connections: Connection[];
    beforeAll(async () => {
        connections = await createTestingConnections({
            entities: [__dirname + "/entity/*{.js,.ts}"],
            enabledDrivers: ["sqlite"],
            schemaCreate: true,
            dropSchema: true
        });
    });
    afterAll(() => closeTestingConnections(connections));

    test("should correctly persist", () => Promise.all(connections.map(async connection => {
        const post = new Post();
        post.type = "post";
        await connection.getRepository(Post).save(post);
    })));

});
