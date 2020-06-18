import {runIfMain} from "../../deps/mocha.ts";
import "../../deps/chai.ts";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils.ts";
import {Connection} from "../../../src/connection/Connection.ts";
import {Post} from "./entity/Post.ts";
import {PostSubscriber} from "./subscriber/PostSubscriber.ts";

describe("github issues > #3256 wrong subscriber methods being called", () => {

    let connections: Connection[];
    before(async () => connections = await createTestingConnections({
        entities: [Post],
        subscribers: [PostSubscriber],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("if entity was changed, subscriber should be take updated columns", () => Promise.all(connections.map(async function(connection) {

        const post = new Post();
        post.id = 1;
        post.title = "hello world";
        await connection.manager.save(post);

        post.inserted.should.be.equal(true);
        post.updated.should.be.equal(false);

        const loadedPost = await connection.getRepository(Post).findOne(1);
        loadedPost!.title = "updated world";
        await connection.manager.save(loadedPost);

        loadedPost!.inserted.should.be.equal(false);
        loadedPost!.updated.should.be.equal(true);

    })));

});

runIfMain(import.meta);
