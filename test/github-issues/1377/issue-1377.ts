import {runIfMain} from "../../deps/mocha.ts";
import "../../deps/chai.ts";
import {Connection} from "../../../src/connection/Connection.ts";
import {closeTestingConnections, createTestingConnections} from "../../utils/test-utils.ts";
import {Post} from "./entity/Post.ts";

describe("github issues > #1377 Add support for `GENERATED ALWAYS AS` in MySQL", () => {

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

    it("should correctly create table with generated columns", () => Promise.all(connections.map(async connection => {
        const queryRunner = connection.createQueryRunner();
        let table = await queryRunner.getTable("post");
        table!.findColumnByName("virtualFullName")!.asExpression!.should.be.equal("concat(`firstName`,' ',`lastName`)");
        table!.findColumnByName("virtualFullName")!.generatedType!.should.be.equal("VIRTUAL");
        table!.findColumnByName("storedFullName")!.asExpression!.should.be.equal("concat(`firstName`,' ',`lastName`)");
        table!.findColumnByName("storedFullName")!.generatedType!.should.be.equal("STORED");

        const metadata = connection.getMetadata(Post);
        const virtualFullNameColumn = metadata.findColumnWithPropertyName("virtualFullName");
        virtualFullNameColumn!.generatedType = "STORED";

        const storedFullNameColumn = metadata.findColumnWithPropertyName("storedFullName");
        storedFullNameColumn!.asExpression = "concat('Mr. ',`firstName`,' ',`lastName`)";
        await connection.synchronize();

        table = await queryRunner.getTable("post");
        table!.findColumnByName("virtualFullName")!.generatedType!.should.be.equal("STORED");
        table!.findColumnByName("storedFullName")!.asExpression!.should.be.equal("concat('Mr. ',`firstName`,' ',`lastName`)");

        await queryRunner.release();
    })));

});

runIfMain(import.meta);
