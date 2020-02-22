import {join as joinPaths} from "../../../vendor/https/deno.land/std/path/mod.ts";
import {runIfMain} from "../../deps/mocha.ts";
import {expect} from "../../deps/chai.ts";
import {getDirnameOfCurrentModule, closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils.ts";
import {Connection} from "../../../src/connection/Connection.ts";
import {Post} from "./entity/Post.ts";
import {Category} from "./entity/Category.ts";

describe("github issues > OneToOne relation with referencedColumnName does not work", () => {

    let connections: Connection[];
    const __dirname = getDirnameOfCurrentModule(import.meta);
    before(async () => connections = await createTestingConnections({
        entities: [joinPaths(__dirname, "/entity/*.ts")],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("custom join column name and referencedColumnName", () => Promise.all(connections.map(async connection => {

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

        expect(loadedPost).not.to.be.undefined;
        expect(loadedPost!.category).not.to.be.undefined;

    })));

});

runIfMain(import.meta);
