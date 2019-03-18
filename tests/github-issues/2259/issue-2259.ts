import "reflect-metadata";
import {createTestingConnections, closeTestingConnections, reloadTestingDatabases} from "../../../test/utils/test-utils";
import {Connection} from "../../../src";
import { TableColumn } from "../../../src";
import { Table } from "../../../src";

describe("github issues > #2259 Missing type for generated columns", () => {

    let connections: Connection[];
    beforeAll(async () => connections = await createTestingConnections({
        enabledDrivers: ["postgres"],
        entities: [__dirname + "/entity/*{.js,.ts}"],
        schemaCreate: true,
        dropSchema: true,
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    afterAll(() => closeTestingConnections(connections));

    test("Should create table with generated column", () => Promise.all(connections.map(async connection => {
        const id = new TableColumn({
            name: "id",
            type: "uuid",
            generationStrategy: "uuid",
            isGenerated: true,
            isPrimary: true
        });
        const client = new Table({
            name: "table",
            columns: [id]
        });
        await connection.createQueryRunner().createTable(client);
    })));

});
