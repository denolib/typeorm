import {join as joinPaths} from "../../../vendor/https/deno.land/std/path/mod.ts";
import {runIfMain} from "../../deps/mocha.ts";
import "../../deps/chai.ts";
import {getDirnameOfCurrentModule, createTestingConnections, closeTestingConnections, reloadTestingDatabases} from "../../utils/test-utils.ts";
import {Connection} from "../../../src/connection/Connection.ts";
import { TableColumn } from "../../../src/schema-builder/table/TableColumn.ts";
import { Table } from "../../../src/schema-builder/table/Table.ts";

describe("github issues > #2259 Missing type for generated columns", () => {

    let connections: Connection[];
    const __dirname = getDirnameOfCurrentModule(import.meta);
    before(async () => connections = await createTestingConnections({
        enabledDrivers: ["postgres"],
        entities: [joinPaths(__dirname, "/entity/*.ts")],
        schemaCreate: true,
        dropSchema: true,
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("Should create table with generated column", () => Promise.all(connections.map(async connection => {
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

runIfMain(import.meta);
