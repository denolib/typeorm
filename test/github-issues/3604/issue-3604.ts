import {join as joinPaths} from "../../../vendor/https/deno.land/std/path/mod.ts";
import {runIfMain} from "../../deps/mocha.ts";
import "../../deps/chai.ts";
import {getDirnameOfCurrentModule, closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils.ts";
import {Connection} from "../../../src/index.ts";
import {Author} from "./entity/Author.ts";
import {Post} from "./entity/Post.ts";

describe("github issues > #3604 FK columns have wrong length when PrimaryGeneratedColumn('uuid') is used.", () => {

    let connections: Connection[];
    const __dirname = getDirnameOfCurrentModule(import.meta);
    before(async () => connections = await createTestingConnections({
        entities: [Author, Post],
        subscribers: [joinPaths(__dirname, "/subscriber/*.ts")],
        enabledDrivers: ["mysql"],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("join column should have the same length with primary column", () => Promise.all(connections.map(async function(connection) {

        const queryRunner = connection.createQueryRunner();
        const table = await queryRunner.getTable("post");
        await queryRunner.release();

        table!.findColumnByName("authorId")!.length!.should.be.equal("36");

    })));

});

runIfMain(import.meta);
