import {runIfMain} from "../../deps/mocha.ts";
import {expect} from "../../deps/chai.ts";
import {createTestingConnections, closeTestingConnections, reloadTestingDatabases} from "../../utils/test-utils.ts";
import {Connection} from "../../../src/connection/Connection.ts";
//import {PostgresDriver} from "../../../src/driver/postgres/PostgresDriver.ts";
import {User} from "./entity/User.ts";

describe("github issues > #2067 Unhandled promise rejection warning on postgres connection issues", () => {

    let connections: Connection[];
    before(async () => connections = await createTestingConnections({
        enabledDrivers: ["postgres"],
        entities: [User],
        schemaCreate: true,
        dropSchema: true,
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("should return a catchable error on connection errors in queries", () => Promise.all(connections.map(async connection => {
        const connectionFailureMessage = "Test error to simulate a connection error";

        if (false/*connection.driver instanceof PostgresDriver*/) { // TODO(uki00a) uncomment this when PostgresDriver is implemented.
          connection.driver.obtainMasterConnection = () => Promise.reject<any>(new Error(connectionFailureMessage));
          connection.driver.obtainSlaveConnection = () => Promise.reject<any>(new Error(connectionFailureMessage));
        }

        const repository = connection.getRepository(User);

        let error;
        try {
            await repository.find();
        } catch (err) {
            error = err;
        }
        expect(error).to.be.instanceOf(Error);
        expect(error.message).to.equal(connectionFailureMessage);
    })));

});

runIfMain(import.meta);
