import "reflect-metadata";
import {
    closeTestingConnections,
    createTestingConnections,
    reloadTestingDatabases
} from "../../../../../test/utils/test-utils";
import {Post} from "./entity/Post";
import {Connection} from "../../../../../src";

describe("database schema > column collation > mysql", () => {

    let connections: Connection[];
    beforeAll(async () => {
        connections = await createTestingConnections({
            entities: [__dirname + "/entity/*{.js,.ts}"],
            enabledDrivers: ["mysql"],
        });
    });
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("should correctly create column with collation option", () => Promise.all(connections.map(async connection => {

        const postRepository = connection.getRepository(Post);
        const queryRunner = connection.createQueryRunner();
        const table = await queryRunner.getTable("post");
        await queryRunner.release();

        const post = new Post();
        post.id = 1;
        post.name = "Post";
        post.title = "Post #1";
        post.description = "This is post";
        await postRepository.save(post);

        expect(table!.findColumnByName("name")!.charset!).toEqual("ascii");
        expect(table!.findColumnByName("name")!.collation!).toEqual("ascii_general_ci");
        expect(table!.findColumnByName("title")!.charset!).toEqual("utf8");
        expect(table!.findColumnByName("title")!.collation!).toEqual("utf8_general_ci");
        expect(table!.findColumnByName("description")!.charset!).toEqual("cp852");
        expect(table!.findColumnByName("description")!.collation!).toEqual("cp852_general_ci");

    })));

});
