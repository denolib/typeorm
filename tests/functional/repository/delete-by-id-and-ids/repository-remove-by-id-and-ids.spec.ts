import "reflect-metadata";
import {Connection} from "../../../../src";
import {Post} from "./entity/Post";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../../utils/test-utils";

describe("repository > deleteById methods", function() {

    // -------------------------------------------------------------------------
    // Configuration
    // -------------------------------------------------------------------------

    let connections: Connection[];
    beforeAll(async () => connections = await createTestingConnections({
        entities: [__dirname + "/entity/*{.js,.ts}"],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    // -------------------------------------------------------------------------
    // Specifications
    // -------------------------------------------------------------------------

    test("remove using deleteById method should delete successfully", () => Promise.all(connections.map(async connection => {
        const postRepository = connection.getRepository(Post);

        // save a new posts
        const newPost1 = postRepository.create();
        newPost1.title = "Super post #1";
        const newPost2 = postRepository.create();
        newPost2.title = "Super post #2";
        const newPost3 = postRepository.create();
        newPost3.title = "Super post #3";
        const newPost4 = postRepository.create();
        newPost4.title = "Super post #4";

        await Promise.all([
            postRepository.save(newPost1),
            postRepository.save(newPost2),
            postRepository.save(newPost3),
            postRepository.save(newPost4)
        ]);

        // remove one
        await postRepository.delete(1);

        // load to check
        const loadedPosts = await postRepository.find();

        // assert
        expect(loadedPosts.length).toEqual(3);
        expect(loadedPosts.find(p => p.id === 1)).toBeUndefined();
        expect(loadedPosts.find(p => p.id === 2)).not.toBeUndefined();
        expect(loadedPosts.find(p => p.id === 3)).not.toBeUndefined();
        expect(loadedPosts.find(p => p.id === 4)).not.toBeUndefined();
    })));

    test("remove using removeByIds method should delete successfully",  () => Promise.all(connections.map(async connection => {
        const postRepository = connection.getRepository(Post);

        // save a new posts
        const newPost1 = postRepository.create();
        newPost1.title = "Super post #1";
        const newPost2 = postRepository.create();
        newPost2.title = "Super post #2";
        const newPost3 = postRepository.create();
        newPost3.title = "Super post #3";
        const newPost4 = postRepository.create();
        newPost4.title = "Super post #4";

        await Promise.all([
            postRepository.save(newPost1),
            postRepository.save(newPost2),
            postRepository.save(newPost3),
            postRepository.save(newPost4)
        ]);

        // remove multiple
        await postRepository.delete([2, 3]);

        // load to check
        const loadedPosts = await postRepository.find();

        // assert
        expect(loadedPosts.length).toEqual(2);
        expect(loadedPosts.find(p => p.id === 1)).not.toBeUndefined();
        expect(loadedPosts.find(p => p.id === 2)).toBeUndefined();
        expect(loadedPosts.find(p => p.id === 3)).toBeUndefined();
        expect(loadedPosts.find(p => p.id === 4)).not.toBeUndefined();
    })));

});
