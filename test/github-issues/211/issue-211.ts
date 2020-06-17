import {runIfMain} from "../../deps/mocha.ts";
import "../../deps/chai.ts";
import { closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils.ts";
import {Connection} from "../../../src/connection/Connection.ts";
import {Post} from "./entity/Post.ts";

describe("github issues > #211 where in query issue", () => {

    let connections: Connection[];
    before(async () => connections = await createTestingConnections({
        entities: [Post],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("should not fail if WHERE IN expression is used", () => Promise.all(connections.map(async connection => {

        for (let i = 0; i < 10; i++) {
            const post1 = new Post();
            post1.title = "post #" + i;
            post1.text = "about post";
            await connection.manager.save(post1);
        }

        const loadedPosts1 = await connection.manager
            .createQueryBuilder(Post, "post")
            .where("post.id IN (:...ids)", { ids: [1, 2, 3] })
            .getMany();

        loadedPosts1.length.should.be.equal(3);

        const loadedPosts2 = await connection.manager
            .createQueryBuilder(Post, "post")
            .where("post.text = :text", { text: "about post" })
            .andWhere("post.title IN (:...titles)", { titles: ["post #1", "post #2", "post #3"] })
            .getMany();

        loadedPosts2.length.should.be.equal(3);
    })));

});

runIfMain(import.meta);
