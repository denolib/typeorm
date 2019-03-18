import "reflect-metadata";
import {createTestingConnections, closeTestingConnections, reloadTestingDatabases} from "../../../test/utils/test-utils";
import {Connection} from "../../../src";
import {Post} from "./entity/Post";

describe("github issues > #1245 `findByIds` ignores `FindManyOptions`", () => {

    let connections: Connection[];
    beforeAll(async () => connections = await createTestingConnections({
        entities: [__dirname + "/entity/*{.js,.ts}"],
        schemaCreate: true,
        dropSchema: true,
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("should filter correctly using findByIds", () => Promise.all(connections.map(async connection => {

        let post1 = new Post();
        post1.name = "some_name";

        let post2 = new Post();
        post2.name = "some_name";

        let post3 = new Post();
        post3.name = "other_name";

        await connection.manager.save([post1, post2, post3]);

        expect(await connection.manager.findByIds(
          Post, [post2.id, post3.id], { name: "some_name" }
        )).toEqual([post2]);

    })));

    test("should filter correctly using findByIds", () => Promise.all(connections.map(async connection => {

        let post1 = new Post();
        post1.name = "some_name";

        let post2 = new Post();
        post2.name = "some_name";

        let post3 = new Post();
        post3.name = "other_name";

        await connection.manager.save([post1, post2, post3]);

        expect(await connection.manager.findByIds(
          Post, [post2.id, post3.id], { where: { name: "some_name" } }
        )).toEqual([post2]);

    })));

});
