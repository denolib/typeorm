import "reflect-metadata";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils";
import {Connection} from "../../../src";
import {Post} from "./entity/Post";
import {Category} from "./entity/Category";

describe("github issues > #47 wrong sql syntax when loading lazy relation", () => {

    let connections: Connection[];
    beforeAll(async () => connections = await createTestingConnections({
        entities: [__dirname + "/entity/*{.js,.ts}"],
        enabledDrivers: ["mysql"] // we can properly test lazy-relations only on one platform
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("should persist successfully and return persisted entity", () => Promise.all(connections.map(async connection => {

        // create objects to save
        const category1 = new Category();
        category1.name = "category #1";

        const post1 = new Post();
        post1.title = "Hello Post #1";
        post1.category = Promise.resolve(category1);

        const category2 = new Category();
        category2.name = "category #2";

        const post2 = new Post();
        post2.title = "Hello Post #2";
        post2.category = Promise.resolve(category2);

        // persist
        await connection.manager.save(category1);
        await connection.manager.save(post1);
        await connection.manager.save(category2);
        await connection.manager.save(post2);

        // check that all persisted objects exist
        const loadedPost = await connection.manager
            .createQueryBuilder(Post, "post")
            .getMany();

        const loadedCategory1 = await loadedPost[0].category;
        expect(loadedCategory1).not.toBeUndefined();
        expect(loadedCategory1!.id).toEqual(1);
        expect(loadedCategory1!.name).toEqual("category #1");

        const loadedCategory2 = await loadedPost[1].category;
        expect(loadedCategory2!).not.toBeUndefined();
        expect(loadedCategory2!.id).toEqual(2);
        expect(loadedCategory2!.name).toEqual("category #2");

        const loadedPosts1 = await loadedCategory1.posts;
        expect(loadedPosts1!).not.toBeUndefined();
        expect(loadedPosts1![0].id).toEqual(1);
        expect(loadedPosts1![0].title).toEqual("Hello Post #1");

        const loadedPosts2 = await loadedCategory2.posts;
        expect(loadedPosts2!).not.toBeUndefined();
        expect(loadedPosts2![0].id).toEqual(2);
        expect(loadedPosts2![0].title).toEqual("Hello Post #2");

        // todo: need to test somehow how query is being generated, or how many raw data is returned

    })));

});
