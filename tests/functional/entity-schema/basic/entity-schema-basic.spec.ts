import "reflect-metadata";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../../../test/utils/test-utils";
import {Connection} from "../../../../src";
import {PostEntity} from "./entity/PostEntity";
import {CategoryEntity} from "./entity/CategoryEntity";

describe("entity schemas > basic functionality", () => {

    let connections: Connection[];
    beforeAll(async () => connections = await createTestingConnections({
        entities: [
            PostEntity,
            CategoryEntity
        ],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("should perform basic operations with entity", () => Promise.all(connections.map(async connection => {

        const postRepository = connection.getRepository(PostEntity);
        const post = postRepository.create({
            title: "First Post",
            text: "About first post",
        });
        await postRepository.save(post);

        const loadedPost = await connection.manager.findOne(PostEntity, { title: "First Post" });
        expect(loadedPost!.id).toEqual(post.id);
        expect(loadedPost!.title).toEqual("First Post");
        expect(loadedPost!.text).toEqual("About first post");
    })));

});
