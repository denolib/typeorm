import "reflect-metadata";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../../test/utils/test-utils";
import {Connection} from "../../../src";
import {Post} from "./entity/Post";
import {Category} from "./entity/Category";

describe("github issues > OneToOne relation with referencedColumnName does not work", () => {

    let connections: Connection[];
    beforeAll(async () => connections = await createTestingConnections({
        entities: [__dirname + "/entity/*{.js,.ts}"],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("custom join column name and referencedColumnName", () => Promise.all(connections.map(async connection => {

        const category = new Category();
        category.name = "category #1";
        await connection.manager.save(category);

        const post = new Post();
        post.title = "post #1";
        post.category = category;
        await connection.manager.save(post);

        const loadedPost = await connection.manager
            .createQueryBuilder(Post, "post")
            .leftJoinAndSelect("post.category", "category")
            .getOne();

        expect(loadedPost).not.toBeUndefined();
        expect(loadedPost!.category).not.toBeUndefined();

    })));

});
