import {runIfMain} from "../../../../deps/mocha.ts";
import "../../../../deps/chai.ts";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../../../utils/test-utils.ts";
import {Connection} from "../../../../../src/index.ts";
import {Employee} from "./entity/Employee.ts";
import {Person} from "./entity/Person.ts";

describe("table-inheritance > single-table > database-option-inherited", () => {

    let connections: Connection[];
    before(async () => connections = await createTestingConnections({
        entities: [Employee, Person]
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("should correctly inherit database option", () => Promise.all(connections.map(async connection => {

        connection.entityMetadatas.forEach(metadata =>
            metadata.database!.should.equal("test"));

    })));

});

runIfMain(import.meta);
