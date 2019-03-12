import "reflect-metadata";
import {Connection} from "../../../../src";
import {
    closeTestingConnections,
    createTestingConnections,
    reloadTestingDatabases
} from "../../../../test/utils/test-utils";

import {Person} from "./entity/Person";

describe("sequences > creating a sequence and marking the column as generated", () => {

    let connections: Connection[];
    beforeAll(async () => connections = await createTestingConnections({
        entities: [Person],
        enabledDrivers: ["postgres"],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("should check that the primary key column is generated automatically", () => Promise.all(connections.map(async connection => {

        const queryRunner = connection.createQueryRunner();
        const table = await queryRunner.getTable("person");
        await queryRunner.release();

        expect(table!.findColumnByName("Id")!.isGenerated).toBeTruthy();

    })));

});
