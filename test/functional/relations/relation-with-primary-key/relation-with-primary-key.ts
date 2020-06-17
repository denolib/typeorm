import {runIfMain} from "../../../deps/mocha.ts";
import "../../../deps/chai.ts";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../../utils/test-utils.ts";
import {Connection} from "../../../../src/connection/Connection.ts";
import {Post} from "./entity/Post.ts";
import {Category} from "./entity/Category.ts";

describe("relations > relation with primary key", () => {

    let connections: Connection[];
    before(async () => connections = await createTestingConnections({
        entities: [Category, Post],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    describe("many-to-one with primary key in relation", function() {

        it("should work perfectly", () => Promise.all(connections.map(async connection => {

            // create first category and post and save them
            const category1 = new Category();
            category1.name = "Category saved by cascades #1";

            const post1 = new Post();
            post1.title = "Hello Post #1";
            post1.category = category1;

            await connection.manager.save(post1);

            // create second category and post and save them
            const category2 = new Category();
            category2.name = "Category saved by cascades #2";

            const post2 = new Post();
            post2.title = "Hello Post #2";
            post2.category = category2;

            await connection.manager.save(post2);

            // now check
            const posts = await connection.manager.find(Post, {
                join: {
                    alias: "post",
                    innerJoinAndSelect: {
                        category: "post.category"
                    }
                },
                order: {
                    category: "ASC"
                }
            });

            posts.should.be.eql([{
                title: "Hello Post #1",
                category: {
                    id: 1,
                    name: "Category saved by cascades #1"
                }
            }, {
                title: "Hello Post #2",
                category: {
                    id: 2,
                    name: "Category saved by cascades #2"
                }
            }]);
        })));

    });

});

runIfMain(import.meta);
