import "reflect-metadata";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../../test/utils/test-utils";
import {Connection} from "../../../src";
import {Post} from "./entity/Post";
import {Category} from "./entity/Category";
import {Tag} from "./entity/Tag";

describe("github issues > #234 and #223 lazy loading does not work correctly from one-to-many and many-to-many sides", () => {

    let connections: Connection[];
    beforeAll(async () => connections = await createTestingConnections({
        entities: [__dirname + "/entity/*{.js,.ts}"],
        enabledDrivers: ["mysql"] // we can properly test lazy-relations only on one platform
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("should correctly load from one-to-many and many-to-one sides", () => Promise.all(connections.map(async connection => {

        // pre-populate database first
        const promises: Promise<any>[] = [];
        for (let i = 1; i <= 10; i++) {
            const post = new Post();
            post.title = "fake post # " + i;
            if (i > 5) {
                const category = new Category();
                category.name = "fake category!";
                post.category = Promise.resolve(category);
            }
            promises.push(connection.manager.save(post));
        }
        await Promise.all(promises);

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
        await connection.manager.save(post1);
        await connection.manager.save(post2);

        // check that all persisted objects exist
        const loadedPosts = await connection.manager
            .createQueryBuilder(Post, "post")
            .where("post.title = :firstTitle OR post.title = :secondTitle", { firstTitle: "Hello Post #1", secondTitle: "Hello Post #2" })
            .getMany();

        const loadedCategory1 = await loadedPosts[0].category;
        expect(loadedCategory1!).not.toBeUndefined();
        expect(loadedCategory1!.name).toEqual("category #1");

        const loadedCategory2 = await loadedPosts[1].category;
        expect(loadedCategory2!).not.toBeUndefined();
        expect(loadedCategory2!.name).toEqual("category #2");

        const loadedPosts1 = await loadedCategory1.posts;
        expect(loadedPosts1!).not.toBeUndefined();
        expect(loadedPosts1![0].title).toEqual("Hello Post #1");

        const loadedPosts2 = await loadedCategory2.posts;
        expect(loadedPosts2!).not.toBeUndefined();
        expect(loadedPosts2![0].title).toEqual("Hello Post #2");

    })));

    test("should correctly load from both many-to-many sides", () => Promise.all(connections.map(async connection => {

        // pre-populate database first
        const promises: Promise<any>[] = [];
        for (let i = 1; i <= 10; i++) {
            const post = new Post();
            post.title = "fake post # " + i;
            for (let j = 1; j <= i; j++) {
                const tag = new Tag();
                tag.name = "fake tag!";
                post.tags = Promise.resolve((await post.tags).concat([tag]));
            }
            promises.push(connection.manager.save(post));
        }
        await Promise.all(promises);

        // create objects to save
        const tag1_1 = new Tag();
        tag1_1.name = "tag #1_1";

        const tag1_2 = new Tag();
        tag1_2.name = "tag #1_2";

        const post1 = new Post();
        post1.title = "Hello Post #1";
        post1.tags = Promise.resolve([tag1_1, tag1_2]);

        const tag2_1 = new Tag();
        tag2_1.name = "tag #2_1";

        const tag2_2 = new Tag();
        tag2_2.name = "tag #2_2";

        const tag2_3 = new Tag();
        tag2_3.name = "tag #2_3";

        const post2 = new Post();
        post2.title = "Hello Post #2";
        post2.tags = Promise.resolve([tag2_1, tag2_2, tag2_3]);

        // persist
        await connection.manager.save(post1);
        await connection.manager.save(post2);

        // check that all persisted objects exist
        const loadedPosts = await connection.manager
            .createQueryBuilder(Post, "post")
            .where("post.title = :firstTitle OR post.title = :secondTitle", { firstTitle: "Hello Post #1", secondTitle: "Hello Post #2" })
            .getMany();

        // check owner side

        const loadedTags1 = await loadedPosts[0].tags;
        expect(loadedTags1).not.toBeUndefined();
        expect(loadedTags1.length).toEqual(2);
        expect(loadedTags1[0].name).toEqual("tag #1_1");
        expect(loadedTags1[1].name).toEqual("tag #1_2");

        const loadedTags2 = await loadedPosts[1].tags;
        expect(loadedTags2).not.toBeUndefined();
        expect(loadedTags2.length).toEqual(3);
        expect(loadedTags2[0].name).toEqual("tag #2_1");
        expect(loadedTags2[1].name).toEqual("tag #2_2");
        expect(loadedTags2[2].name).toEqual("tag #2_3");

        // check inverse side

        const loadedPosts1 = await loadedTags1[0].posts;
        expect(loadedPosts1).not.toBeUndefined();
        expect(loadedPosts1.length).toEqual(1);
        expect(loadedPosts1[0].title).toEqual("Hello Post #1");

        const loadedPosts2 = await loadedTags2[0].posts;
        expect(loadedPosts2).not.toBeUndefined();
        expect(loadedPosts2.length).toEqual(1);
        expect(loadedPosts2[0].title).toEqual("Hello Post #2");

    })));

});
