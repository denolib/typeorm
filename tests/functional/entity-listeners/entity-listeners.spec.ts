import {Connection} from "../../../src";
import {closeTestingConnections, createTestingConnections} from "../../utils/test-utils";
import {Post} from "./entity/Post";

describe("entity-listeners", () => {

    let connections: Connection[];
    beforeAll(async () => connections = await createTestingConnections({
        entities: [__dirname + "/entity/*{.js,.ts}"],
        dropSchema: true,
        schemaCreate: true
    }));
    afterAll(() => closeTestingConnections(connections));

    test("beforeUpdate", () => Promise.all(connections.map(async connection => {
        const post = new Post();
        post.title = "post title";
        post.text = "post text";
        await connection.manager.save(post);

        let loadedPost = await connection.getRepository(Post).findOne(post.id);
        loadedPost!.title = "post title   ";
        await connection.manager.save(loadedPost);

        loadedPost = await connection.getRepository(Post).findOne(post.id);
        expect(loadedPost!.title).toEqual("post title");
    })));

});
