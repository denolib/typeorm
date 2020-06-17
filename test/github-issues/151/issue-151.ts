import {runIfMain} from "../../deps/mocha.ts";
import {expect} from "../../deps/chai.ts";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils.ts";
import {Connection} from "../../../src/connection/Connection.ts";
import {Post} from "./entity/Post.ts";
import {PostMetadata} from "./entity/PostMetadata.ts";
import {Category} from "./entity/Category.ts";

describe("github issues > #151 joinAndSelect can't find entity from inverse side of relation", () => {

    let connections: Connection[];
    before(async () => connections = await createTestingConnections({
        entities: [Category, Post, PostMetadata],
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
