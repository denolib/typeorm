import {runIfMain} from "../../deps/mocha.ts";
import {expect} from "../../deps/chai.ts";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils.ts";
import {Connection} from "../../../src/connection/Connection.ts";
import {Post} from "./entity/Post.ts";

describe("github issues > #1118 findByIds must return empty results if no criteria were passed in an array", () => {

    let connections: Connection[];
    before(async () => connections = await createTestingConnections({
        entities: [Post],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("drivers which does not support offset without limit should throw an exception, other drivers must work fine", () => Promise.all(connections.map(async connection => {
        const post = new Post();
        post.name = "post #1";
        await connection.manager.save(post);

        expect(await connection.manager.findByIds(Post, [1])).to.eql([{
            id: 1,
            name: "post #1"
        }]);

        expect(await connection.manager.findByIds(Post, [])).to.eql([]);
    })));

});

runIfMain(import.meta);
