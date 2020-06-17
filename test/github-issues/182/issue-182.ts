import {runIfMain} from "../../deps/mocha.ts";
import {expect} from "../../deps/chai.ts";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils.ts";
import {Connection} from "../../../src/connection/Connection.ts";
import {Post} from "./entity/Post.ts";
import {PostStatus} from "./model/PostStatus.ts";

describe("github issues > #182 enums are not saved properly", () => {

    let connections: Connection[];
    before(async () => connections = await createTestingConnections({
        entities: [Post],
        enabledDrivers: ["mysql"] // we can properly test lazy-relations only on one platform
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("should persist successfully with enum values", () => Promise.all(connections.map(async connection => {

        const post1 = new Post();
        post1.status = PostStatus.NEW;
        post1.title = "Hello Post #1";

        // persist
        await connection.manager.save(post1);

        const loadedPosts1 = await connection.manager.findOne(Post, { where: { title: "Hello Post #1" } });
        expect(loadedPosts1!).not.to.be.undefined;
        loadedPosts1!.should.be.eql({
            id: 1,
            title: "Hello Post #1",
            status: PostStatus.NEW
        });

        // remove persisted
        await connection.manager.remove(post1);

        const post2 = new Post();
        post2.status = PostStatus.ACTIVE;
        post2.title = "Hello Post #1";

        // persist
        await connection.manager.save(post2);

        const loadedPosts2 = await connection.manager.findOne(Post, { where: { title: "Hello Post #1" } });
        expect(loadedPosts2!).not.to.be.undefined;
        loadedPosts2!.should.be.eql({
            id: 2,
            title: "Hello Post #1",
            status: PostStatus.ACTIVE
        });

        // remove persisted
        await connection.manager.remove(post2);

        const post3 = new Post();
        post3.status = PostStatus.ACHIEVED;
        post3.title = "Hello Post #1";

        // persist
        await connection.manager.save(post3);

        const loadedPosts3 = await connection.manager.findOne(Post, { where: { title: "Hello Post #1" } });
        expect(loadedPosts3!).not.to.be.undefined;
        loadedPosts3!.should.be.eql({
            id: 3,
            title: "Hello Post #1",
            status: PostStatus.ACHIEVED
        });

        // remove persisted
        await connection.manager.remove(post3);

    })));

});

runIfMain(import.meta);
