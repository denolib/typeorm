import {runIfMain} from "../../deps/mocha.ts";
import "../../deps/chai.ts";
import {Connection} from "../../../src/connection/Connection.ts";
import {closeTestingConnections, createTestingConnections} from "../../utils/test-utils.ts";
import {Post} from "./entity/Post.ts";

describe("github issues > #1427 precision and scale column types with errant behavior", () => {

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

    it("should correctly create column with precision and scale", () => Promise.all(connections.map(async connection => {
        const queryRunner = connection.createQueryRunner();
        let table = await queryRunner.getTable("post");
        await queryRunner.release();

        table!.findColumnByName("qty")!.type.should.be.equal("decimal");
        table!.findColumnByName("qty")!.precision!.should.be.equal(10);
        table!.findColumnByName("qty")!.scale!.should.be.equal(6);
    })));

});

runIfMain(import.meta);
