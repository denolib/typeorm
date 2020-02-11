import {runIfMain} from "../../../../deps/mocha.ts";
import {expect} from "../../../../deps/chai.ts";
import {Post} from "./entity/Post.ts";
import {Connection} from "../../../../../src/connection/Connection.ts";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../../../utils/test-utils.ts";

describe("database schema > column length > mysql", () => {

    let connections: Connection[];
    before(async () => {
        connections = await createTestingConnections({
            entities: [Post],
            enabledDrivers: ["mysql"],
        });
    });
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("all types should be created with correct length", () => Promise.all(connections.map(async connection => {

        const queryRunner = connection.createQueryRunner();
        const table = await queryRunner.getTable("post");
        await queryRunner.release();

        expect(table!.findColumnByName("char")!.length).to.be.equal("50");
        expect(table!.findColumnByName("varchar")!.length).to.be.equal("50");

    })));

    it("all types should update their length", () => Promise.all(connections.map(async connection => {

        let metadata = connection.getMetadata(Post);
        metadata.findColumnWithPropertyName("char")!.length = "100";
        metadata.findColumnWithPropertyName("varchar")!.length = "100";

        await connection.synchronize(false);

        const queryRunner = connection.createQueryRunner();
        const table = await queryRunner.getTable("post");
        await queryRunner.release();

        expect(table!.findColumnByName("char")!.length).to.be.equal("100");
        expect(table!.findColumnByName("varchar")!.length).to.be.equal("100");

    })));

});

runIfMain(import.meta);
