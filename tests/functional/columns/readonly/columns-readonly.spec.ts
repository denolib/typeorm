import "reflect-metadata";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../../utils/test-utils";
import {Connection} from "../../../../src";
import {Post} from "./entity/Post";

describe("columns > readonly functionality", () => {

    let connections: Connection[];
    beforeAll(async () => connections = await createTestingConnections({
        entities: [Post],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("should not update columns marked with readonly property", () => Promise.all(connections.map(async connection => {

        const postRepository = connection.getRepository(Post);

        // create and save a post first
        const post = new Post();
        post.title = "About columns";
        post.text = "Some text about columns";
        post.authorName = "Umed";
        await postRepository.save(post);

        // then update all its properties and save again
        post.title = "About columns1";
        post.text = "Some text about columns1";
        post.authorName = "Umed1";
        await postRepository.save(post);

        // check if all columns are updated except for readonly columns
        const loadedPost = await postRepository.findOne(post.id);
        expect(loadedPost!.title).toEqual("About columns1");
        expect(loadedPost!.text).toEqual("Some text about columns1");
        expect(loadedPost!.authorName).toEqual("Umed1");

    })));


});
