import "../../../deps/chai.ts";
import {runIfMain} from "../../../deps/mocha.ts";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../../utils/test-utils.ts";
import {Connection} from "../../../../src/connection/Connection.ts";
import {Customer} from "./entity/Customer.ts";

describe("indices > basic unique index test", () => {

    let connections: Connection[];
    before(async () => connections = await createTestingConnections({
        entities: [Customer],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    describe("unique index", function() {

        it("should work without errors", () => Promise.all(connections.map(async connection => {
            const customer = new Customer();
            customer.nameEnglish = "Umed";
            customer.nameHebrew = "Uma";
            await connection.manager.save(customer);
        })));

    });

});

runIfMain(import.meta);
