import {join as joinPaths} from "../../../vendor/https/deno.land/std/path/mod.ts";
import {runIfMain} from "../../deps/mocha.ts";
import {expect} from "../../deps/chai.ts";
import {Connection} from "../../../src/connection/Connection.ts";
import {getDirnameOfCurrentModule, closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils.ts";
import {Post} from "./entity/Post.ts";

describe("github issues > #485 If I set the datatype of PrimaryGeneratedColumn to uuid then it is not giving the uuid to the column.", () => {

    let connections: Connection[];
    const __dirname = getDirnameOfCurrentModule(import.meta);
    before(async () => {
        connections = await createTestingConnections({
            entities: [joinPaths(__dirname, "/entity/*.ts")],
            enabledDrivers: ["postgres"],
        });
    });
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("should persist uuid correctly when it used as PrimaryGeneratedColumn type", () => Promise.all(connections.map(async connection => {

        const postRepository = connection.getRepository(Post);
        const queryRunner = connection.createQueryRunner();
        const table = await queryRunner.getTable("post");
        await queryRunner.release();

        const post = new Post();
        const savedPost = await postRepository.save(post);
        const loadedPost = await postRepository.findOne(savedPost.id);

        expect(loadedPost).to.be.not.undefined;
        expect(loadedPost!.id).to.equal(savedPost.id);
        table!.findColumnByName("id")!.type.should.be.equal("uuid");
    })));
});

runIfMain(import.meta);
