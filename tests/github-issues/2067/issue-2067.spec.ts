import "reflect-metadata";
import {createTestingConnections, closeTestingConnections, reloadTestingDatabases} from "../../../test/utils/test-utils";
import {Connection} from "../../../src";
import {PostgresDriver} from "../../../src/driver/postgres/PostgresDriver";
import {User} from "./entity/User";

describe("github issues > #2067 Unhandled promise rejection warning on postgres connection issues", () => {

    let connections: Connection[];
    beforeAll(async () => connections = await createTestingConnections({
        enabledDrivers: ["postgres"],
        entities: [__dirname + "/entity/*{.js,.ts}"],
        schemaCreate: true,
        dropSchema: true,
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("should return a catchable error on connection errors in queries", () => Promise.all(connections.map(async connection => {
        const connectionFailureMessage = "Test error to simulate a connection error";

        if (connection.driver instanceof PostgresDriver) {
          connection.driver.obtainMasterConnection = () => Promise.reject<any>(new Error(connectionFailureMessage));
          connection.driver.obtainSlaveConnection = () => Promise.reject<any>(new Error(connectionFailureMessage));
        }

        const repository = connection.getRepository(User);
        return expect(repository.find()).rejects.toBeDefined();
    })));

});
