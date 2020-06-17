import {runIfMain} from "../../deps/mocha.ts";
import {expect} from "../../deps/chai.ts";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils.ts";
import {Connection} from "../../../src/connection/Connection.ts";
import {Post} from "./entity/Post.ts";

describe("github issues > #388 skip and take with string ID don't work", () => {

    let connections: Connection[];
    before(async () => connections = await createTestingConnections({
        entities: [Post],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("should load posts with string id successfully", () => Promise.all(connections.map(async connection => {

        const posts: Post[] = [];
        for (let i = 1; i <= 25; i++) {
            const post = new Post();
            post.lala_id = "post #" + i;
            post.title = "hello post";
            post.index = i;
            posts.push(post);
        }
        await connection.manager.save(posts);

        const loadedPosts = await connection.manager
            .createQueryBuilder(Post, "post")
            .skip(5)
            .take(10)
            .orderBy("post.index")
            .getMany();

        expect(loadedPosts).to.length(10);
        expect(loadedPosts[0].lala_id).to.be.equal("post #6");
        expect(loadedPosts[9].lala_id).to.be.equal("post #15");

    })));

});

runIfMain(import.meta);
