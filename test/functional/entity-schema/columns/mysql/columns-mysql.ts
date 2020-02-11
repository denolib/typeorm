import {runIfMain} from "../../../../deps/mocha.ts";
import "../../../../deps/chai.ts";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../../../utils/test-utils.ts";
import {Connection} from "../../../../../src/connection/Connection.ts";
import {PersonSchema} from "./entity/Person.ts";

// TODO(uki00a) Remove `.skip` when MysqlDriver is implemented.
describe.skip("entity-schema > columns > mysql", () => {

    let connections: Connection[];
    before(async () => connections = await createTestingConnections({
        entities: [PersonSchema as any],
        enabledDrivers: ["mysql"]
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("should create columns with different options", () => Promise.all(connections.map(async connection => {

        const queryRunner = connection.createQueryRunner();
        const table = await queryRunner.getTable("person");
        await queryRunner.release();

        table!.findColumnByName("Id")!.unsigned!.should.be.true;
        table!.findColumnByName("PostCode")!.zerofill!.should.be.true;
        table!.findColumnByName("PostCode")!.unsigned!.should.be.true;
        table!.findColumnByName("PostCode")!.width!.should.be.equal(9);
        table!.findColumnByName("VirtualFullName")!.asExpression!.should.be.equal("concat(`FirstName`,' ',`LastName`)");
        table!.findColumnByName("VirtualFullName")!.generatedType!.should.be.equal("VIRTUAL");
        table!.findColumnByName("StoredFullName")!.asExpression!.should.be.equal("concat(`FirstName`,' ',`LastName`)");
        table!.findColumnByName("StoredFullName")!.generatedType!.should.be.equal("STORED");
        table!.findColumnByName("LastVisitDate")!.onUpdate!.should.be.equal("CURRENT_TIMESTAMP(3)");

    })));

});

runIfMain(import.meta);
