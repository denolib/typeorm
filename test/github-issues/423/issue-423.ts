import {runIfMain} from "../../deps/mocha.ts";
import {expect} from "../../deps/chai.ts";
// import {CockroachDriver} from "../../../src/driver/cockroachdb/CockroachDriver";
import {closeTestingConnections, createTestingConnections} from "../../utils/test-utils.ts";
import {Connection} from "../../../src/connection/Connection.ts";
import {Group} from "./entity/Group.ts";

describe("github issues > #423 Cannot use Group as Table name && cannot autoSchemeSync when use alias Entity", () => {

    let connections: Connection[];
    before(async () => connections = await createTestingConnections({
        entities: [Group],
        schemaCreate: false,
        dropSchema: true
    }));
    after(() => closeTestingConnections(connections));

    it("should successfully sync schema", () => Promise.all(connections.map(async connection => {
        await connection.synchronize();

        const queryRunner = connection.createQueryRunner();
        const table = await queryRunner.getTable("groups");
        await queryRunner.release();

        table!.should.exist;

        // CockroachDB stores unique indices as UNIQUE constraints
        if (false/*connection.driver instanceof CockroachDriver*/) { // TODO(uki00a) uncomment this when CockroachDriver is implemented.
            table!.uniques.length.should.be.equal(1);
            table!.uniques[0].name!.should.be.equal("Groups name");
            table!.uniques[0].columnNames[0].should.be.equal("name");
        } else {
            table!.indices.length.should.be.equal(1);
            table!.indices[0].name!.should.be.equal("Groups name");
            table!.indices[0].columnNames[0].should.be.equal("name");
            table!.indices[0].isUnique!.should.be.true;
        }

    })));

});

runIfMain(import.meta);
