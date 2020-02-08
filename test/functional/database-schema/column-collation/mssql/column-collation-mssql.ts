import {join as joinPaths} from "../../../../../vendor/https/deno.land/std/path/mod.ts";
import {runIfMain} from "../../../../deps/mocha.ts";
import "../../../../deps/chai.ts";
import {Post} from "./entity/Post.ts";
import {Connection} from "../../../../../src/connection/Connection.ts";
import {getDirnameOfCurrentModule, closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../../../utils/test-utils.ts";

describe("database schema > column collation > mssql", () => {

    let connections: Connection[];
    const __dirname = getDirnameOfCurrentModule(import.meta);
    before(async () => {
        connections = await createTestingConnections({
            entities: [joinPaths(__dirname, "/entity/*.ts")],
            enabledDrivers: ["mssql"],
        });
    });
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("should correctly create column with collation option", () => Promise.all(connections.map(async connection => {

        const postRepository = connection.getRepository(Post);
        const queryRunner = connection.createQueryRunner();
        const table = await queryRunner.getTable("post");
        await queryRunner.release();

        const post = new Post();
        post.id = 1;
        post.name = "Post";
        await postRepository.save(post);

        table!.findColumnByName("name")!.collation!.should.be.equal("French_CI_AS");

    })));

});

runIfMain(import.meta);
