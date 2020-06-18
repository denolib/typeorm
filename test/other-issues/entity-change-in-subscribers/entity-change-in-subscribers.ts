import {runIfMain} from "../../deps/mocha.ts";
import {expect} from "../../deps/chai.ts";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils.ts";
import {Connection} from "../../../src/connection/Connection.ts";
import {Post} from "./entity/Post.ts";
import {PostCategory} from "./entity/PostCategory.ts";
import {PostSubscriber} from "./subscriber/PostSubscriber.ts";

describe("other issues > entity change in subscribers should affect persistence", () => {

    let connections: Connection[];
    before(async () => connections = await createTestingConnections({
        entities: [Post, PostCategory],
        subscribers: [PostSubscriber],
        enabledDrivers: ["postgres", "mysql", "mariadb", "mssql", "oracle", "mongodb", "cockroachdb"] // TODO(uki00a) `sqlite` is ommited because `@UpdateDateColumn` doesn't currently work. Remove `enableDrivers` when deno-sqite supports `datetime('now')`.
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("if entity was changed, subscriber should be take updated columns", () => Promise.all(connections.map(async function(connection) {

        const category1 = new PostCategory();
        category1.name = "category #1";

        const post = new Post();
        post.title = "hello world";
        post.category = category1;
        await connection.manager.save(post);

        // check if it was inserted correctly
        const loadedPost = await connection.manager.findOne(Post);
        expect(loadedPost).not.to.be.undefined;
        loadedPost!.active.should.be.equal(false);

        // now update some property and let update subscriber trigger
        const category2 = new PostCategory();
        category2.name = "category #2";
        loadedPost!.category = category2;
        loadedPost!.active = true;
        loadedPost!.title += "!";
        await connection.manager.save(loadedPost!);

        // check if subscriber was triggered and entity was really taken changed columns in the subscriber
        const loadedUpdatedPost = await connection.manager.findOne(Post);

        expect(loadedUpdatedPost).not.to.be.undefined;
        expect(loadedUpdatedPost!.updatedColumns).to.equals(2);
        expect(loadedUpdatedPost!.updatedRelations).to.equals(1);

        await connection.manager.save(loadedPost!);

    })));

});

runIfMain(import.meta);
