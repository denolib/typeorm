import "reflect-metadata";
import {Connection} from "../../../../src";
import {
    closeTestingConnections,
    createTestingConnections,
    reloadTestingDatabases
} from "../../../utils/test-utils";
import {Post} from "./entity/Post";

describe("database schema > mssql-parameters", () => {

    let connections: Connection[];
    beforeAll(async () => {
        connections = await createTestingConnections({
            entities: [__dirname + "/entity/*{.js,.ts}"],
            enabledDrivers: ["mssql"],
        });
    });
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("should correctly insert/update/delete entities on SqlServer driver", () => Promise.all(connections.map(async connection => {

        const postRepository = connection.getRepository(Post);

        const post1 = new Post();
        post1.id = 1;
        post1.name = "Post #1";
        post1.category = "posts";
        post1.text = "This is post";
        await postRepository.save(post1);

        let loadedPost1 = (await postRepository.findOne(1))!;

        expect(loadedPost1.id).toEqual(post1.id);
        expect(loadedPost1.name).toEqual(post1.name);
        expect(loadedPost1.category).toEqual(post1.category);
        expect(loadedPost1.text).toEqual(post1.text);

        loadedPost1.name = "Updated Post #1";
        loadedPost1.text = "This is updated post";
        await postRepository.save(loadedPost1);

        loadedPost1 = (await postRepository.findOne(1))!;
        expect(loadedPost1.name).toEqual("Updated Post #1");
        expect(loadedPost1.text).toEqual("This is updated post");

        await postRepository.remove(loadedPost1);
        loadedPost1 = (await postRepository.findOne(1))!;
        expect(loadedPost1).toBeUndefined();

        const post2 = new Post();
        post2.id = 2;
        post2.name = "Post #2";
        post2.category = "posts";
        post2.text = "This is second post";

        await connection.createQueryBuilder()
            .insert()
            .into(Post)
            .values(post2)
            .execute();

        let loadedPost2 = (await postRepository.findOne(2))!;
        expect(loadedPost2.id).toEqual(post2.id);
        expect(loadedPost2.name).toEqual(post2.name);
        expect(loadedPost2.category).toEqual(post2.category);
        expect(loadedPost2.text).toEqual(post2.text);

        await connection.createQueryBuilder()
            .update(Post)
            .set({ name: "Updated Post #2" })
            .where("id = :id", { id: 2 })
            .execute();

        loadedPost2 = (await postRepository.findOne(2))!;
        expect(loadedPost2.name).toEqual("Updated Post #2");

        await connection.createQueryBuilder()
            .delete()
            .from(Post)
            .where("id = :id", { id: "2" })
            .execute();

        loadedPost2 = (await postRepository.findOne(2))!;
        expect(loadedPost2).toBeUndefined();

    })));

});
