import "reflect-metadata";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils";
import {Connection} from "../../../src";
import {Post} from "./entity/Post";

describe("github issue > #1397 Spaces at the end of values are removed when inserting", () => {

    let connections: Connection[] = [];
    beforeAll(async () => connections = await createTestingConnections({
        entities: [__dirname + "/entity/*{.js,.ts}"],
        enabledDrivers: ["mysql"]
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("should not trim empty spaces when saving", () => Promise.all(connections.map(async connection => {

        const post = new Post();
        post.title = " About My Post   ";
        await connection.manager.save(post);
        expect(post.title).toEqual(" About My Post   ");

        const loadedPost = await connection.manager.findOne(Post, { id: 1 });
        expect(loadedPost).not.toBeUndefined();
        expect(loadedPost!.title).toEqual(" About My Post   ");
    })));

});
