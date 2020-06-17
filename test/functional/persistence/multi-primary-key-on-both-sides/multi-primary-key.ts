import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../../utils/test-utils.ts";
import {Connection} from "../../../../src/connection/Connection.ts";
import {Post} from "./entity/Post.ts";
import {Category} from "./entity/Category.ts";
import "../../../deps/chai.ts";
import {runIfMain} from "../../../deps/mocha.ts";

describe("persistence > multi primary keys", () => {

    let connections: Connection[];
    before(async () => connections = await createTestingConnections({
        entities: [Category, Post],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    describe("insert", function () {

        it("should insert entity when there are multi column primary keys", () => Promise.all(connections.map(async connection => {
            const post1 = new Post();
            post1.title = "Hello Post #1";
            post1.firstId = 1;
            post1.secondId = 2;

            await connection.manager.save(post1);

            // create first category and post and save them
            const category1 = new Category();
            category1.categoryId = 123;
            category1.name = "Category saved by cascades #1";
            category1.posts = [post1];

            await connection.manager.save(category1);

            // now check
            const posts = await connection.manager.find(Post, {
                join: {
                    alias: "post",
                    innerJoinAndSelect: {
                        category: "post.category"
                    }
                },
                order: {
                    firstId: "ASC"
                }
            });

            posts.should.be.eql([{
                firstId: 1,
                secondId: 2,
                title: "Hello Post #1",
                category: {
                    categoryId: 123,
                    name: "Category saved by cascades #1"
                }
            }]);
        })));
    });
});

runIfMain(import.meta);
