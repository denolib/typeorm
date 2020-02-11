import {runIfMain} from "../../../deps/mocha.ts";
import {expect} from "../../../deps/chai.ts";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../../utils/test-utils.ts";
import {Connection} from "../../../../src/connection/Connection.ts";
import {Post} from "./entity/Post.ts";

describe("columns > getters and setters", () => {

    let connections: Connection[];
    before(async () => connections = await createTestingConnections({
        entities: [Post],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("should not update columns marked with readonly property", () => Promise.all(connections.map(async connection => {

        const postRepository = connection.getRepository(Post);

        // create and save a post first
        const post = new Post();
        post.title = "hello";
        await postRepository.save(post);

        // check if title is a value applied by a setter
        const loadedPost1 = await postRepository.findOne(post.id);
        expect(loadedPost1!.title).to.be.equal("bye");

        // try to load a column by its value
        const loadedPost2 = await postRepository.findOne({ title: "bye" });
        expect(loadedPost2!.title).to.be.equal("bye");

    })));


});

runIfMain(import.meta);
