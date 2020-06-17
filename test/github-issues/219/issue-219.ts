import {runIfMain} from "../../deps/mocha.ts";
import "../../deps/chai.ts";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils.ts";
import {Connection} from "../../../src/connection/Connection.ts";
import {Post} from "./entity/Post.ts";

describe("github issues > #219 FindOptions should be able to resolve null values", () => {

    let connections: Connection[];
    before(async () => connections = await createTestingConnections({
        entities: [Post],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("should properly query null values", () => Promise.all(connections.map(async connection => {

        const promises: Promise<any>[] = [];
        for (let i = 1; i <= 10; i++) {
            const post1 = new Post();
            post1.title = "post #" + i;
            post1.text = i > 5 ? "about post" : null;
            promises.push(connection.manager.save(post1));
        }
        await Promise.all(promises);

        const postsWithoutText1 = await connection.manager.find(Post, { where: { text: null } });
        postsWithoutText1.length.should.be.equal(5);

        const postsWithText1 = await connection.manager.find(Post, { where: {  text: "about post" } });
        postsWithText1.length.should.be.equal(5);

    })));

});

runIfMain(import.meta);
