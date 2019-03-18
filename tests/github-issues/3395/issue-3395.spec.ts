import "reflect-metadata";
import { closeTestingConnections, createTestingConnections, reloadTestingDatabases } from "../../../test/utils/test-utils";
import { Connection } from "../../../src";
import { Post } from "./entity/Post";

describe("github issues > #3395 Transform.from does nothing when column is NULL", () => {

    let connections: Connection[];
    beforeAll(async () => connections = await createTestingConnections({
        entities: [Post]
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("should run transform from if column is null", () => Promise.all(connections.map(async function (connection) {

        const post = new Post();
        post.id = 1;
        await connection.getRepository(Post).save(post);

        const loadedPost = await connection.getRepository(Post).findOne(1);

        expect(loadedPost!.text)!.toEqual("This is null");
    })));

});
