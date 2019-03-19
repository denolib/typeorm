import "reflect-metadata";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils";
import {Connection} from "../../../src";
import {Post} from "./entity/Post";
import {Category} from "./entity/Category";

describe("github issues > #703.findOne does not return an empty array on OneToMany relationship", () => {

    let connections: Connection[];
    beforeAll(async () => connections = await createTestingConnections({
        entities: [__dirname + "/entity/*{.js,.ts}"],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("should not return anything in joined relation if nothing was found", () => Promise.all(connections.map(async connection => {

        const category = new Category();
        category.firstId = 1;
        category.secondId = 2;
        category.name = "category about posts";
        await connection.manager.save(category);

        const post = new Post();
        post.title = "new post";
        post.categories = [];
        await connection.manager.save(post);

        const loadedPost = await connection.getRepository(Post).findOne(1, {
            relations: ["categories"]
        });

        expect(loadedPost!.id).toEqual(1);
        expect(loadedPost!.title).toEqual("new post");
        expect(loadedPost!.categories.length).toEqual(0);

    })));

});
