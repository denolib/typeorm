import "reflect-metadata";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../../utils/test-utils";
import {Connection} from "../../../../src";
import {Customer} from "./entity/Customer";
import {Profile} from "./entity/Profile";

describe("indices > embeds index test", () => {

    let connections: Connection[];
    beforeAll(async () => connections = await createTestingConnections({
        entities: [__dirname + "/entity/*{.js,.ts}"]
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    describe("embeddeds index", function() {

        test("should work without errors", () => Promise.all(connections.map(async connection => {
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
