import "reflect-metadata";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils";
import {Connection} from "../../../src";
import {Post} from "./entity/Post";

describe("other issues > hydration performance", () => {

    let connections: Connection[];
    beforeAll(async () => connections = await createTestingConnections({
        entities: [__dirname + "/entity/*{.js,.ts}"],
        enabledDrivers: ["mysql"]
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("if entity was changed in the listener, changed property should be updated in the db", () => Promise.all(connections.map(async function(connection) {

        // insert few posts first
        const posts: Post[] = [];
        for (let i = 1; i <= 100000; i++) {
            posts.push(new Post("Post #" + i));
        }
        await connection.manager.insert(Post, posts);

        // select them using raw sql
        // console.time("select using raw sql");
        const loadedRawPosts = await connection.manager.query("SELECT * FROM post");
        expect(loadedRawPosts.length).toEqual(100000);
        // console.timeEnd("select using raw sql");

        // now select them using ORM
        // console.time("select using ORM");
        const loadedOrmPosts = await connection.manager.find(Post);
        expect(loadedOrmPosts.length).toEqual(100000);
        // console.timeEnd("select using ORM");

    })));

});
