import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../../utils/test-utils.ts";
import {Connection} from "../../../../src/connection/Connection.ts";
import {expect} from "../../../deps/chai.ts";
import {runIfMain} from "../../../deps/mocha.ts";

import {Person} from "./entity/Person.ts";

describe("sequences > creating a sequence and marking the column as generated", () => {

    let connections: Connection[];
    before(async () => connections = await createTestingConnections({
        entities: [Person],
        enabledDrivers: ["postgres"],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    describe("create table and check that primary key column is marked as generated", function() {

        it("should check that the primary key column is generated automatically", () => Promise.all(connections.map(async connection => {

            const queryRunner = connection.createQueryRunner();
            const table = await queryRunner.getTable("person");
            await queryRunner.release();

            expect(table!.findColumnByName("Id")!.isGenerated).to.be.true;

        })));

    });

});

runIfMain(import.meta);
