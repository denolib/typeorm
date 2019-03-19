import "reflect-metadata";
import {Connection} from "../../../../../src";
import {
    closeTestingConnections,
    createTestingConnections,
    reloadTestingDatabases
} from "../../../../utils/test-utils";

describe("table-inheritance > single-table > database-option-inherited", () => {

    let connections: Connection[];
    beforeAll(async () => connections = await createTestingConnections({
        entities: [__dirname + "/entity/*{.js,.ts}"]
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("should correctly inherit database option", () => Promise.all(connections.map(async connection => {

        connection.entityMetadatas.forEach(metadata =>
            expect(metadata.database!).toEqual("test"));

    })));

});
