import {Connection} from "../../../src/index.ts";
import {closeTestingConnections, createTestingConnections} from "../../utils/test-utils.ts";
import {Post} from "./entity/Post.ts";
import "../../deps/chai.ts";
import {runIfMain} from "../../deps/mocha.ts";

describe("entity-listeners", () => {

    let connections: Connection[];
    before(async () => connections = await createTestingConnections({
        entities: [Post],
        dropSchema: true,
        schemaCreate: true
    }));
    after(() => closeTestingConnections(connections));

    it("beforeUpdate", () => Promise.all(connections.map(async connection => {
        const post = new Post();
        post.title = "post title";
        post.text = "post text";
        await connection.manager.save(post);

        let loadedPost = await connection.getRepository(Post).findOne(post.id);
        loadedPost!.title = "post title   ";
        await connection.manager.save(loadedPost);

        loadedPost = await connection.getRepository(Post).findOne(post.id);
        loadedPost!.title.should.be.equal("post title");
    })));

});

runIfMain(import.meta);
