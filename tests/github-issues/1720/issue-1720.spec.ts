import "reflect-metadata";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../../test/utils/test-utils";
import {Connection} from "../../../src";
import {Post} from "./entity/Post";
import {Category} from "./entity/Category";

describe("github issues > #1720 Listener not invoked when relation loaded through getter", () => {

    let connections: Connection[];
    beforeAll(async () => connections = await createTestingConnections({
        entities: [__dirname + "/entity/*{.js,.ts}"],
        enabledDrivers: ["mysql"]
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("should work as expected", () => Promise.all(connections.map(async connection => {
        const category1 = new Category();
        category1.name = "cat #1";
        await connection.manager.save(category1);

        const category2 = new Category();
        category2.name = "cat #2";
        await connection.manager.save(category2);

        const post1 = new Post();
        post1.title = "post #1";
        post1.categories = [category1, category2];
        await connection.manager.save(post1);

        const loadedPost = await connection.manager.findOne(Post, { relations: ["categories"] });
        expect(loadedPost!.categories[0].loaded).toEqual(true);
        expect(loadedPost!.categories[1].loaded).toEqual(true);
    })));

});
