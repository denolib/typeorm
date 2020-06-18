import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../../utils/test-utils.ts";
import {Connection} from "../../../../src/connection/Connection.ts";
import {Customer} from "./entity/Customer.ts";
import {Profile} from "./entity/Profile.ts";
import "../../../deps/chai.ts";
import {runIfMain} from "../../../deps/mocha.ts";

describe("indices > embeds index test", () => {

    let connections: Connection[];
    before(async () => connections = await createTestingConnections({
        entities: [Customer, Profile]
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    describe("embeddeds index", function() {

        it("should work without errors", () => Promise.all(connections.map(async connection => {
            const customer = new Customer();
            customer.nameEnglish = "Umed";
            customer.nameHebrew = "Uma";
            customer.profile = new Profile();
            customer.profile.job = "Developer";
            customer.profile.address = "Anywhere";
            await connection.manager.save(customer);
        })));

    });

});

runIfMain(import.meta);
