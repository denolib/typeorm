import {runIfMain} from "../../deps/mocha.ts";
import "../../deps/chai.ts";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils.ts";
import {Connection} from "../../../src/connection/Connection.ts";
import {Post} from "./entity/Post.ts";

describe("github issues > #4719 HStore with empty string values", () => {
    let connections: Connection[];
    before(async () => connections = await createTestingConnections({
        entities: [Post],
        enabledDrivers: ["postgres"]
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("should handle HStore with empty string keys or values", () => Promise.all(connections.map(async connection => {
      const queryRunner = connection.createQueryRunner();
      const postRepository = connection.getRepository(Post);

      const post = new Post();
      post.hstoreObj = {name: "Alice", surname: "A", age: 25, blank: "", "": "blank-key", "\"": "\"", foo: null};
      const {id} = await postRepository.save(post);

      const loadedPost = await postRepository.findOneOrFail(id);
      loadedPost.hstoreObj.should.be.deep.equal(
        { name: "Alice", surname: "A", age: "25", blank: "", "": "blank-key", "\"": "\"", foo: null });
      await queryRunner.release();
    })));

    it("should not allow 'hstore injection'", () => Promise.all(connections.map(async connection => {
      const queryRunner = connection.createQueryRunner();
      const postRepository = connection.getRepository(Post);

      const post = new Post();
      post.hstoreObj = { username: `", admin=>"1`, admin: "0" };
      const {id} = await postRepository.save(post);

      const loadedPost = await postRepository.findOneOrFail(id);
      loadedPost.hstoreObj.should.be.deep.equal({ username: `", admin=>"1`, admin: "0" });
      await queryRunner.release();
    })));
});

runIfMain(import.meta);
