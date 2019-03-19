import "reflect-metadata";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils";
import {Connection} from "../../../src";
import {Post} from "./entity/Post";
import { Category } from "./entity/Category";

describe("github issues > #1576 Entities with null as `id` are merged [@next]", () => {

    let connections: Connection[];
    beforeAll(async () => connections = await createTestingConnections({
        entities: [__dirname + "/entity/*{.js,.ts}"],
        enabledDrivers: ["postgres"]
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("should successfully create object", () => Promise.all(connections.map(async connection => {
        const newpost = new Post();
        let cat1 = new Category();
        cat1.name2 = "1";
        let cat2 = new Category();
        cat2.name = "2";
        newpost.categories = [cat1, cat2];

        const post = connection.manager.create(Post, newpost);

        expect(post.categories).toHaveLength(2);
    })));

});
