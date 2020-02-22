import {runIfMain} from "../../deps/mocha.ts";
import "../../deps/chai.ts";
import { closeTestingConnections, createTestingConnections, reloadTestingDatabases } from "../../utils/test-utils.ts";
import { Connection } from "../../../src/connection/Connection.ts";
import { Post } from "./entity/Post.ts";

describe("github issues > #3395 Transform.from does nothing when column is NULL", () => {

    let connections: Connection[];
    before(async () => connections = await createTestingConnections({
        entities: [Post]
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("should run transform from if column is null", () => Promise.all(connections.map(async function (connection) {

        const post = new Post();
        post.id = 1;
        await connection.getRepository(Post).save(post);

        const loadedPost = await connection.getRepository(Post).findOne(1);

        loadedPost!.text!.should.be.eq("This is null");
    })));

});

runIfMain(import.meta);
