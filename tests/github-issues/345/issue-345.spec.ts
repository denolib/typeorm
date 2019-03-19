import "reflect-metadata";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../../test/utils/test-utils";
import {Connection} from "../../../src";
import {Post} from "./entity/Post";
import {Category} from "./entity/Category";

describe("github issues > Join query on ManyToMany relations not working", () => {

    let connections: Connection[];
    beforeAll(async () => connections = await createTestingConnections({
        entities: [__dirname + "/entity/*{.js,.ts}"],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("embedded with custom column name should persist and load without errors", () => Promise.all(connections.map(async connection => {

        for (let i = 0; i < 20; i++) {
            const category = new Category();
            category.name = "Category #" + i;
            await connection.manager.save(category);
        }

        const post = new Post();
        post.title = "SuperRace";
        post.categories = [new Category()];
        post.categories[0].name = "SuperCategory";
        await connection.manager.save(post);

        const loadedPost = await connection
            .manager
            .createQueryBuilder(Post, "post")
            .leftJoinAndSelect("post.categories", "category")
            .where("category.category_id IN (:...ids)", { ids: [21] })
            .getOne();

        expect(loadedPost).not.toBeUndefined();
        expect(loadedPost!.categories).not.toBeUndefined();

    })));

});
