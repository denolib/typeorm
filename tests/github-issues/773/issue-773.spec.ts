import "reflect-metadata";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../../test/utils/test-utils";
import {Connection} from "../../../src";
import {Post} from "./entity/Post";

describe("github issues > #773 @PrimaryGeneratedColumn not returning auto generated id from oracle database", () => {

    let connections: Connection[];
    beforeAll(async () => connections = await createTestingConnections({
        entities: [__dirname + "/entity/*{.js,.ts}"],
        enabledDrivers: ["oracle"],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("should return auto generated column", () => Promise.all(connections.map(async connection => {
        const post = new Post();
        post.name = "My post";
        await connection.getRepository(Post).save(post);
        expect(post.id).not.toBeUndefined();
        expect(post.createdDate).not.toBeUndefined();
        expect(post.updatedDate).not.toBeUndefined();
    })));

});
