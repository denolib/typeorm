import "reflect-metadata";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils";
import {Connection} from "../../../src";
import {Category} from "./entity/Category";
import {Post} from "./entity/Post";

describe("github issues > #3350 ER_DUP_FIELDNAME with simple find", () => {

    let connections: Connection[];
    beforeAll(async () => connections = await createTestingConnections({
        entities: [__dirname + "/entity/*{.js,.ts}"],
        subscribers: [__dirname + "/subscriber/*{.js,.ts}"],
        enabledDrivers: ["mysql"],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("should find without errors", () => Promise.all(connections.map(async function(connection) {

        const post = new Post();
        post.category = new Category();
        post.category.name = "new category";
        await connection.manager.save(post.category);
        await connection.manager.save(post);

        const loadedPost = await connection
            .getRepository(Post)
            .findOne(1, { relations: ["category"] });
        expect(loadedPost).toBeDefined();
        expect(loadedPost!.category).toBeDefined();

    })));

});
