import {join as joinPaths} from "../../../vendor/https/deno.land/std/path/mod.ts";
import {runIfMain} from "../../deps/mocha.ts";
import {expect} from "../../deps/chai.ts";
import {getDirnameOfCurrentModule, closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils.ts";
import {Connection} from "../../../src/connection/Connection.ts";
import {Category} from "./entity/Category.ts";
import {Post} from "./entity/Post.ts";

describe("github issues > #3350 ER_DUP_FIELDNAME with simple find", () => {

    let connections: Connection[];
    const __dirname = getDirnameOfCurrentModule(import.meta);
    before(async () => connections = await createTestingConnections({
        entities: [Category, Post],
        subscribers: [joinPaths(__dirname, "/subscriber/*.ts")],
        enabledDrivers: ["mysql"],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("should find without errors", () => Promise.all(connections.map(async function(connection) {

        const post = new Post();
        post.category = new Category();
        post.category.name = "new category";
        await connection.manager.save(post.category);
        await connection.manager.save(post);

        const loadedPost = await connection
            .getRepository(Post)
            .findOne(1, { relations: ["category"] });
        expect(loadedPost).to.be.not.empty;
        expect(loadedPost!.category).to.be.not.empty;

    })));

});

runIfMain(import.meta);
