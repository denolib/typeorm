import "reflect-metadata";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils";
import {Connection} from "../../../src";
import {Post} from "./entity/Post";
import {Category} from "./entity/Category";

describe("github issues > #70 cascade deleting works incorrect", () => {

    let connections: Connection[];
    beforeAll(async () => connections = await createTestingConnections({
        entities: [__dirname + "/entity/*{.js,.ts}"],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("should persist successfully and return persisted entity", () => Promise.all(connections.map(async connection => {

        // create objects to save
        const category1 = new Category();
        category1.name = "category #1";

        const category2 = new Category();
        category2.name = "category #2";

        const post = new Post();
        post.title = "Hello Post #1";
        post.categories = [category1, category2];

        // persist post (other are persisted by cascades)
        await connection.manager.save(post);

        // check that all persisted objects exist
        const loadedPost = await connection.manager
            .createQueryBuilder(Post, "post")
            .innerJoinAndSelect("post.categories", "category")
            .orderBy("post.id, category.id")
            .getOne()!;

        const loadedCategories = await connection.manager
            .createQueryBuilder(Category, "category")
            .orderBy("category.id")
            .getMany();

        expect(loadedPost!).not.toBeUndefined();
        expect(loadedPost).toMatchObject({
            id: 1,
            title: "Hello Post #1",
        });

        expect(loadedPost!.categories.length).toEqual(2);
        expect(loadedCategories).not.toBeUndefined();
        expect(loadedCategories[0].id).toEqual(1);
        expect(loadedCategories[1].id).toEqual(2);

        // now remove post. categories should be removed too
        await connection.manager.remove(post);

        // load them again to make sure they are not exist anymore
        const loadedPosts2 = await connection.manager
            .createQueryBuilder(Post, "post")
            .getMany();

        const loadedCategories2 = await connection.manager
            .createQueryBuilder(Category, "category")
            .getMany();

        expect(loadedPosts2).toEqual([]);
        expect(loadedCategories2).toEqual([]);

    })));

});
