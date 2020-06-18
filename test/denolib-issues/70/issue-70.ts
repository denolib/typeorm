import {join as joinPaths} from "../../../vendor/https/deno.land/std/path/mod.ts";
import {runIfMain} from "../../deps/mocha.ts";
import {expect} from "../../deps/chai.ts";
import {getDirnameOfCurrentModule, closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils.ts";
import {Connection} from "../../../src/connection/Connection.ts";
import {Post} from "./entity/Post.ts";
import {Category} from "./entity/Category.ts";

describe("denolib issues > #70 dynamic imports of entities using the glob pattern", () => {

    let connections: Connection[];
    const __dirname = getDirnameOfCurrentModule(import.meta);
    before(async () => connections = await createTestingConnections({
        entities: [joinPaths(__dirname, "/entity/*.ts")]
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("should import entities that match the glob pattern", () => connections.map(connection => {
        expect(connection.entityMetadatas).to.have.lengthOf(2);
        expect(connection.entityMetadatas.find(x => x.target === Post)).not.to.be.undefined;
        expect(connection.entityMetadatas.find(x => x.target === Category)).not.to.be.undefined;
    }));
});

runIfMain(import.meta);
