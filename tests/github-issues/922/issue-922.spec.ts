import "reflect-metadata";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils";
import {Connection} from "../../../src";
import {Post} from "./entity/Post";
import {ObjectLiteral} from "../../../src";

describe("github issues > #922 Support HSTORE column type", () => {

    let connections: Connection[];
    beforeAll(async () => connections = await createTestingConnections({
        entities: [__dirname + "/entity/*{.js,.ts}"],
        enabledDrivers: ["postgres"]
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("should correctly implement HSTORE type", () => Promise.all(connections.map(async connection => {

        const queryRunner = connection.createQueryRunner();
        const postRepository = connection.getRepository(Post);
        const table = await queryRunner.getTable("post");

        const post = new Post();
        post.hstoreObj = {name: "Alice", surname: "A", age: 25};
        post.hstoreStr = "name => Bob, surname => B, age => 30";
        await postRepository.save(post);

        const loadedPost = await postRepository.findOne(1);
        expect((loadedPost!.hstoreObj as ObjectLiteral).name).toEqual("Alice");
        expect((loadedPost!.hstoreObj as ObjectLiteral).surname).toEqual("A");
        expect((loadedPost!.hstoreObj as ObjectLiteral).age).toEqual("25");
        expect(loadedPost!.hstoreStr).toEqual(`"age"=>"30", "name"=>"Bob", "surname"=>"B"`);
        expect(table!.findColumnByName("hstoreObj")!.type).toEqual("hstore");
        await queryRunner.release();
    })));

});
