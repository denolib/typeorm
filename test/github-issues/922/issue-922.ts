import {runIfMain} from "../../deps/mocha.ts";
import "../../deps/chai.ts";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils.ts";
import {Connection} from "../../../src/connection/Connection.ts";
import {Post} from "./entity/Post.ts";
import {ObjectLiteral} from "../../../src/index.ts";

describe("github issues > #922 Support HSTORE column type", () => {

    let connections: Connection[];
    before(async () => connections = await createTestingConnections({
        entities: [Post],
        enabledDrivers: ["postgres"]
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("should correctly implement HSTORE type", () => Promise.all(connections.map(async connection => {

        const queryRunner = connection.createQueryRunner();
        const postRepository = connection.getRepository(Post);
        const table = await queryRunner.getTable("post");

        const post = new Post();
        post.hstoreObj = {name: "Alice", surname: "A", age: 25};
        post.hstoreStr = "name => Bob, surname => B, age => 30";
        await postRepository.save(post);

        const loadedPost = await postRepository.findOne(1);
        (loadedPost!.hstoreObj as ObjectLiteral).name.should.be.equal("Alice");
        (loadedPost!.hstoreObj as ObjectLiteral).surname.should.be.equal("A");
        (loadedPost!.hstoreObj as ObjectLiteral).age.should.be.equal("25");
        loadedPost!.hstoreStr.should.be.equal(`"age"=>"30", "name"=>"Bob", "surname"=>"B"`);
        table!.findColumnByName("hstoreObj")!.type.should.be.equal("hstore");
        await queryRunner.release();
    })));

});

runIfMain(import.meta);
