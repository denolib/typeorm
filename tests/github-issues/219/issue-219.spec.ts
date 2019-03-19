import "reflect-metadata";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../../test/utils/test-utils";
import {Connection} from "../../../src";
import {Post} from "./entity/Post";

describe("github issues > #219 FindOptions should be able to resolve null values", () => {

    let connections: Connection[];
    beforeAll(async () => connections = await createTestingConnections({
        entities: [__dirname + "/entity/*{.js,.ts}"],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("should properly query null values", () => Promise.all(connections.map(async connection => {

        const promises: Promise<any>[] = [];
        for (let i = 1; i <= 10; i++) {
            const post1 = new Post();
            post1.title = "post #" + i;
            post1.text = i > 5 ? "about post" : null;
            promises.push(connection.manager.save(post1));
        }
        await Promise.all(promises);

        const postsWithoutText1 = await connection.manager.find(Post, { where: { text: null } });
        expect(postsWithoutText1.length).toEqual(5);

        const postsWithText1 = await connection.manager.find(Post, { where: {  text: "about post" } });
        expect(postsWithText1.length).toEqual(5);

    })));

});
