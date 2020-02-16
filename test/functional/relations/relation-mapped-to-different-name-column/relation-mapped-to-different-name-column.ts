import {join as joinPaths} from "../../../../vendor/https/deno.land/std/path/mod.ts";
import {runIfMain} from "../../../deps/mocha.ts";
import "../../../deps/chai.ts";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases, getDirnameOfCurrentModule} from "../../../utils/test-utils.ts";
import {Connection} from "../../../../src/connection/Connection.ts";
import {Post} from "./entity/Post.ts";
import {PostDetails} from "./entity/PostDetails.ts";

describe.skip("relations > relation mapped to relation with different name (#56)", () => { // skipped because of CI error. todo: needs investigation

    let connections: Connection[];
    const __dirname = getDirnameOfCurrentModule(import.meta);
    before(async () => connections = await createTestingConnections({
        entities: [joinPaths(__dirname, "/entity/*.ts")],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("should work perfectly", () => Promise.all(connections.map(async connection => {

        // first create and save details
        const details = new PostDetails();
        details.keyword = "post-1";
        await connection.manager.save(details);

        // then create and save a post with details
        const post1 = new Post();
        post1.title = "Hello Post #1";
        post1.details = details;
        await connection.manager.save(post1);

        // now check
        const posts = await connection.manager.find(Post, {
            join: {
                alias: "post",
                innerJoinAndSelect: {
                    details: "post.details"
                }
            }
        });

        posts.should.be.eql([{
            id: 1,
            title: "Hello Post #1",
            details: {
                keyword: "post-1"
            }
        }]);
    })));

});

runIfMain(import.meta);
