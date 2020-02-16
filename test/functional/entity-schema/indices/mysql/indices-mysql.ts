import "../../../../deps/chai.ts";
import {runIfMain} from "../../../../deps/mocha.ts";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../../../utils/test-utils.ts";
import {Connection} from "../../../../../src/connection/Connection.ts";
import {PersonSchema} from "./entity/Person.ts";

// TODO(uki00a) uncomment this when MysqlDriver is implemented.
describe.skip("entity-schema > indices > mysql", () => {

    let connections: Connection[];
    before(async () => connections = await createTestingConnections({
        entities: [PersonSchema as any],
        enabledDrivers: ["mysql"]
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("should correctly create SPATIAL and FULLTEXT indices", () => Promise.all(connections.map(async connection => {

        const queryRunner = connection.createQueryRunner();
        const table = await queryRunner.getTable("person");
        await queryRunner.release();

        const spatialIndex = table!.indices.find(index => !!index.isSpatial);
        spatialIndex!.should.be.exist;
        const fulltextIndex = table!.indices.find(index => !!index.isFulltext);
        fulltextIndex!.should.be.exist;

    })));

});

runIfMain(import.meta);
