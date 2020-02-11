import {runIfMain} from "../../../../deps/mocha.ts";
import {expect} from "../../../../deps/chai.ts";
import {Post} from "./entity/Post.ts";
import {Connection} from "../../../../../src/connection/Connection.ts";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../../../utils/test-utils.ts";

describe("database schema > column length > sqlite", () => {

    let connections: Connection[];
    before(async () => {
        connections = await createTestingConnections({
            entities: [Post],
            enabledDrivers: ["sqlite"],
        });
    });
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("all types should create with correct size", () => Promise.all(connections.map(async connection => {

        const queryRunner = connection.createQueryRunner();
        const table = await queryRunner.getTable("post");
        await queryRunner.release();

        expect(table!.findColumnByName("character")!.length).to.be.equal("50");
        expect(table!.findColumnByName("varchar")!.length).to.be.equal("50");
        expect(table!.findColumnByName("nchar")!.length).to.be.equal("50");
        expect(table!.findColumnByName("nvarchar")!.length).to.be.equal("50");
        expect(table!.findColumnByName("varying_character")!.length).to.be.equal("50");
        expect(table!.findColumnByName("native_character")!.length).to.be.equal("50");

    })));

    it("all types should update their size", () => Promise.all(connections.map(async connection => {

        let metadata = connection.getMetadata(Post);
        metadata.findColumnWithPropertyName("character")!.length = "100";
        metadata.findColumnWithPropertyName("varchar")!.length = "100";
        metadata.findColumnWithPropertyName("nchar")!.length = "100";
        metadata.findColumnWithPropertyName("nvarchar")!.length = "100";
        metadata.findColumnWithPropertyName("varying_character")!.length = "100";
        metadata.findColumnWithPropertyName("native_character")!.length = "100";

        await connection.synchronize(false);

        const queryRunner = connection.createQueryRunner();
        const table = await queryRunner.getTable("post");
        await queryRunner.release();

        expect(table!.findColumnByName("character")!.length).to.be.equal("100");
        expect(table!.findColumnByName("varchar")!.length).to.be.equal("100");
        expect(table!.findColumnByName("nchar")!.length).to.be.equal("100");
        expect(table!.findColumnByName("nvarchar")!.length).to.be.equal("100");
        expect(table!.findColumnByName("varying_character")!.length).to.be.equal("100");
        expect(table!.findColumnByName("native_character")!.length).to.be.equal("100");

        await connection.synchronize(false);

    })));

});

runIfMain(import.meta);
