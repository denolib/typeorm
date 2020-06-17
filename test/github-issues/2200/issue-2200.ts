import {runIfMain} from "../../deps/mocha.ts";
import "../../deps/chai.ts";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils.ts";
import {Connection} from "../../../src/connection/Connection.ts";
import {Booking} from "./entity/Booking.ts";
import {Contact} from "./entity/Contact.ts";
import {NamingStrategyUnderTest} from "./naming/NamingStrategyUnderTest.ts";


describe("github issue > #2200 Bug - Issue with snake_case naming strategy", () => {

    let connections: Connection[];
    let namingStrategy = new NamingStrategyUnderTest();

    before(async () => connections = await createTestingConnections({
        entities: [Booking, Contact],
        namingStrategy
    }));
    beforeEach(() => {
        return reloadTestingDatabases(connections);
    });
    after(() => closeTestingConnections(connections));


    it("Renammed alias allow to query correctly", () => Promise.all(connections.map(async connection => {
        await connection.getRepository(Booking).find({take: 10});
    })));

});

runIfMain(import.meta);
