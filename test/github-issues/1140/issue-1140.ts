import {runIfMain} from "../../deps/mocha.ts";
import {expect} from "../../deps/chai.ts";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils.ts";
import {Connection} from "../../../src/connection/Connection.ts";
import {Post} from "./entity/Post.ts";

describe("github issues > #1140 timestamp column and value transformer causes TypeError", () => {

    let connections: Connection[];
    before(async () => connections = await createTestingConnections({
        entities: [Post],
        schemaCreate: true,
        dropSchema: true,
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("correctly store/load timestamp columns", () => Promise.all(connections.map(async connection => {
        const date = new Date();
        date.setMilliseconds(0); // Because some databases don't have millisecond resolution
        const dateNumber = date.getTime();

        const post = new Post();
        post.ts = dateNumber;
        await connection.manager.save(post);

        const loadedPosts = await connection.manager.find(Post);
        loadedPosts.length.should.be.equal(1);
        expect(loadedPosts[0].ts).to.be.equal(dateNumber);
    })));
});

runIfMain(import.meta);
