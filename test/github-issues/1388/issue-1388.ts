import {runIfMain} from "../../deps/mocha.ts";
import "../../deps/chai.ts";
import {Connection} from "../../../src/connection/Connection.ts";
import {closeTestingConnections, createTestingConnections} from "../../utils/test-utils.ts";
import {Post} from "./entity/Post.ts";

describe("github issues > #1388 nullable: true dons't output 'NULL' in mysql", () => {

    let connections: Connection[];
    before(async () => {
        connections = await createTestingConnections({
            entities: [Post],
            enabledDrivers: ["mysql"],
            schemaCreate: true,
            dropSchema: true,
        });
    });
    after(() => closeTestingConnections(connections));

    it("should correctly create nullable column", () => Promise.all(connections.map(async connection => {
        const queryRunner = connection.createQueryRunner();
        const table = await queryRunner.getTable("post");
        table!.findColumnByName("createdAt")!.isNullable.should.be.true;
        await queryRunner.release();
    })));

});

runIfMain(import.meta);
