import {runIfMain} from "../../deps/mocha.ts";
import "../../deps/chai.ts";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils.ts";
import {Connection} from "../../../src/connection/Connection.ts";
import {Post} from "./entity/Post.ts";

describe("github issues > #463 saving empty string array", () => {

    let connections: Connection[];
    before(async () => connections = await createTestingConnections({
        entities: [Post],
        enabledDrivers: ["postgres"],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("should not return array with single empty string if empty array was saved", () => Promise.all(connections.map(async connection => {
        const post = new Post();
        post.names = [];
        await connection.getRepository(Post).save(post);
        const loadedPost = await connection.getRepository(Post).findOne(1);
        loadedPost!.names.length.should.be.eql(0);
    })));

});

runIfMain(import.meta);
