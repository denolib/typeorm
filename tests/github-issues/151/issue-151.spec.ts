import "reflect-metadata";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../../test/utils/test-utils";
import {Connection} from "../../../src";
import {Post} from "./entity/Post";
import {Category} from "./entity/Category";

describe("github issues > #151 joinAndSelect can't find entity from inverse side of relation", () => {

    let connections: Connection[];
    beforeAll(async () => connections = await createTestingConnections({
        entities: [__dirname + "/entity/*{.js,.ts}"],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("should cascade persist successfully", () => Promise.all(connections.map(async connection => {

        const category = new Category();
        category.name = "post category";

        const post = new Post();
        post.title = "Hello post";
        post.category = category;

        await connection.manager.save(post);

        const loadedPost = await connection.manager.findOne(Post, 1, {
            join: {
                alias: "post",
                innerJoinAndSelect: {
                    category: "post.category"
                }
            }
        });

        expect(loadedPost).not.toBeUndefined();
        expect(loadedPost)!.toEqual({
            id: 1,
            title: "Hello post",
            category: {
                id: 1,
                name: "post category"
            }
        });

    })));

});
