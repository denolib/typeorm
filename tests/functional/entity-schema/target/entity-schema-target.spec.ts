import "reflect-metadata";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../../utils/test-utils";
import {Connection} from "../../../../src";
import {PostEntity} from "./entity/PostEntity";
import {Post} from "./model/Post";

describe("entity schemas > target option", () => {

    let connections: Connection[];
    beforeAll(async () => connections = await createTestingConnections({
        entities: [PostEntity],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("should create instance of the target", () => Promise.all(connections.map(async connection => {
        const postRepository = connection.getRepository(Post);
        const post = postRepository.create({
            title: "First Post",
            text: "About first post",
        });
        expect(post).toBeInstanceOf(Post);
    })));

    test("should find instances of the target", () => Promise.all(connections.map(async connection => {
        const postRepository = connection.getRepository(Post);
        const post = new Post();
        post.title = "First Post";
        post.text = "About first post";
        await postRepository.save(post);

        const loadedPost = await postRepository.findOne({ title: "First Post" });
        expect(loadedPost)!.toBeInstanceOf(Post);
    })));

});
