import {runIfMain} from "../../deps/mocha.ts";
import "../../deps/chai.ts";
import {Connection} from "../../../src/connection/Connection.ts";
import {closeTestingConnections, createTestingConnections} from "../../utils/test-utils.ts";
import {Post} from "./entity/Post.ts";

describe("github issues > #1733 Postgresql driver does not detect/support varying without length specified", () => {

    let connections: Connection[];
    before(async () => {
        connections = await createTestingConnections({
            entities: [Post],
            enabledDrivers: ["postgres"],
            schemaCreate: true,
            dropSchema: true,
        });
    });
    after(() => closeTestingConnections(connections));

    it("should correctly synchronize schema when varchar column length is not specified", () => Promise.all(connections.map(async connection => {
        const queryRunner = connection.createQueryRunner();
        let table = await queryRunner.getTable("post");

        table!.findColumnByName("name")!.length.should.be.empty;
        table!.findColumnByName("name2")!.length.should.be.equal("255");

        const postMetadata = connection.getMetadata(Post);
        const column1 = postMetadata.findColumnWithPropertyName("name")!;
        const column2 = postMetadata.findColumnWithPropertyName("name2")!;
        column1.length = "500";
        column2.length = "";

        await connection.synchronize();

        table = await queryRunner.getTable("post");
        table!.findColumnByName("name")!.length.should.be.equal("500");
        table!.findColumnByName("name2")!.length.should.be.empty;

        column1.length = "";
        column2.length = "255";

        await connection.synchronize();

        table = await queryRunner.getTable("post");
        table!.findColumnByName("name")!.length.should.be.empty;
        table!.findColumnByName("name2")!.length.should.be.equal("255");

        await queryRunner.release();
    })));

});

runIfMain(import.meta);
