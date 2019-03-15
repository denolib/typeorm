import "reflect-metadata";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../../test/utils/test-utils";
import {Connection} from "../../../src";
import {Post} from "./entity/Post";
import {Category} from "./entity/Category";

describe("other issues > using limit in conjunction with order by", () => {

    let connections: Connection[];
    beforeAll(async () => connections = await createTestingConnections({
        entities: [__dirname + "/entity/*{.js,.ts}"],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("should persist successfully and return persisted entity", () => Promise.all(connections.map(async function(connection) {

        // generate bulk array of posts with categories
        for (let i = 1; i <= 100; i++) {

            const post = new Post();
            post.title = "Hello Post #" + i;
            post.categories = [];

            for (let i = 1; i <= 5; i++) {
                const category = new Category();
                category.name = "category #" + i;
                post.categories.push(category);
            }
            await connection.manager.save(post);
        }

        // check if ordering by main object works correctly

        const loadedPosts1 = await connection.manager
            .createQueryBuilder(Post, "post")
            .innerJoinAndSelect("post.categories", "categories")
            .take(10)
            .orderBy("post.id", "DESC")
            .getMany();

        expect(loadedPosts1).not.toBeUndefined();
        expect(loadedPosts1.length).toEqual(10);
        expect(loadedPosts1[0].id).toEqual(100);
        expect(loadedPosts1[1].id).toEqual(99);
        expect(loadedPosts1[2].id).toEqual(98);
        expect(loadedPosts1[3].id).toEqual(97);
        expect(loadedPosts1[4].id).toEqual(96);
        expect(loadedPosts1[5].id).toEqual(95);
        expect(loadedPosts1[6].id).toEqual(94);
        expect(loadedPosts1[7].id).toEqual(93);
        expect(loadedPosts1[8].id).toEqual(92);
        expect(loadedPosts1[9].id).toEqual(91);

    })));

});
