import "../../../deps/chai.ts";
import {runIfMain} from "../../../deps/mocha.ts";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../../utils/test-utils.ts";
import {Connection} from "../../../../src/index.ts";
import {PostEntity} from "./entity/PostEntity.ts";
import {CategoryEntity} from "./entity/CategoryEntity.ts";

describe("entity schemas > basic functionality", () => {

    let connections: Connection[];
    before(async () => connections = await createTestingConnections({
        entities: [
            PostEntity,
            CategoryEntity
        ],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("should perform basic operations with entity", () => Promise.all(connections.map(async connection => {

        const postRepository = connection.getRepository(PostEntity);
        const post = postRepository.create({
            title: "First Post",
            text: "About first post",
        });
        await postRepository.save(post);

        const loadedPost = await connection.manager.findOne(PostEntity, { title: "First Post" });
        loadedPost!.id.should.be.equal(post.id);
        loadedPost!.title.should.be.equal("First Post");
        loadedPost!.text.should.be.equal("About first post");
    })));

});

runIfMain(import.meta);
