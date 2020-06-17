import {runIfMain} from "../../../deps/mocha.ts";
import "../../../deps/chai.ts";
import {closeTestingConnections, createTestingConnections} from "../../../utils/test-utils.ts";
import {Connection} from "../../../../src/connection/Connection.ts";
import {Person} from "./entity/Person.ts";

describe("database-schema > rowid-column", () => {

    let connections: Connection[];
    before(async () => connections = await createTestingConnections({
        entities: [Person],
        enabledDrivers: ["cockroachdb"],
        dropSchema: true,
        schemaCreate: true,
    }));
    after(() => closeTestingConnections(connections));

    it("should create `rowid` generated column", () => Promise.all(connections.map(async connection => {

        const queryRunner = connection.createQueryRunner();
        const table = await queryRunner.getTable("person");
        await queryRunner.release();

        table!.findColumnByName("id")!.type.should.be.equal("int8");
        table!.findColumnByName("id")!.isGenerated.should.be.equal(true);
        table!.findColumnByName("id")!.generationStrategy!.should.be.equal("rowid");

        table!.findColumnByName("id2")!.type.should.be.equal("int8");
        table!.findColumnByName("id2")!.isGenerated.should.be.equal(true);
        table!.findColumnByName("id2")!.generationStrategy!.should.be.equal("rowid");

        table!.findColumnByName("id3")!.type.should.be.equal("int8");
        table!.findColumnByName("id3")!.isGenerated.should.be.equal(true);
        table!.findColumnByName("id3")!.generationStrategy!.should.be.equal("rowid");

        table!.findColumnByName("id4")!.type.should.be.equal("int8");
        table!.findColumnByName("id4")!.isGenerated.should.be.equal(true);
        table!.findColumnByName("id4")!.generationStrategy!.should.be.equal("rowid");

    })));

});

runIfMain(import.meta);
