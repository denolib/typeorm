import {runIfMain} from "../../deps/mocha.ts";
import "../../deps/chai.ts";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils.ts";
import {Connection} from "../../../src/connection/Connection.ts";
import {Category} from "./entity/Category.ts";
import {Post} from "./entity/Post.ts";

describe("github issues > #190 too many SQL variables when using setMaxResults in SQLite", () => {

    let connections: Connection[];
    before(async () => connections = await createTestingConnections({
        entities: [Category, Post],
        enabledDrivers: ["sqlite"] // this issue only related to sqlite
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("should not fail if high max results is used", () => Promise.all(connections.map(async connection => {

        for (let i = 0; i < 1000; i++) {
            const post1 = new Post();
            post1.title = "Hello Post #1";
            await connection.manager.save(post1);
        }

        const loadedPosts = await connection.manager
            .createQueryBuilder(Post, "post")
            .leftJoinAndSelect("post.categories", "categories")
            .take(1000)
            .getMany();

        loadedPosts.length.should.be.equal(1000);
    })));

});

runIfMain(import.meta);
