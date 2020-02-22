import {join as joinPaths} from "../../../vendor/https/deno.land/std/path/mod.ts";
import {runIfMain} from "../../deps/mocha.ts";
import {expect} from "../../deps/chai.ts";
import {getDirnameOfCurrentModule, closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils.ts";
import {Connection} from "../../../src/connection/Connection.ts";
import {Post} from "./entity/Post.ts";
import {Category} from "./entity/Category.ts";

describe("github issues > #151 joinAndSelect can't find entity from inverse side of relation", () => {

    let connections: Connection[];
    const __dirname = getDirnameOfCurrentModule(import.meta);
    before(async () => connections = await createTestingConnections({
        entities: [joinPaths(__dirname, "/entity/*.ts")],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("should cascade persist successfully", () => Promise.all(connections.map(async connection => {

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

        expect(loadedPost).not.to.be.undefined;
        loadedPost!.should.be.eql({
            id: 1,
            title: "Hello post",
            category: {
                id: 1,
                name: "post category"
            }
        });

    })));

});

runIfMain(import.meta);
