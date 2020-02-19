import {join as joinPaths} from "../../../vendor/https/deno.land/std/path/mod.ts";
import {runIfMain} from "../../deps/mocha.ts";
import "../../deps/chai.ts";
import {getDirnameOfCurrentModule, closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils.ts";
import {Connection} from "../../../src/connection/Connection.ts";
import {Post} from "./entity/Post.ts";
import {Category} from "./entity/Category.ts";

describe("github issues > #703.findOne does not return an empty array on OneToMany relationship", () => {

    let connections: Connection[];
    const __dirname = getDirnameOfCurrentModule(import.meta);
    before(async () => connections = await createTestingConnections({
        entities: [joinPaths(__dirname, "/entity/*.ts")],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("should not return anything in joined relation if nothing was found", () => Promise.all(connections.map(async connection => {

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

        loadedPost!.id.should.be.equal(1);
        loadedPost!.title.should.be.equal("new post");
        loadedPost!.categories.length.should.be.equal(0);

    })));

});

runIfMain(import.meta);
